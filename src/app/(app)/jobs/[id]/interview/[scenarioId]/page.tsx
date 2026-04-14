"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Send,
  SkipForward,
  Square,
  Star,
  Zap,
} from "lucide-react";
import { AudioRecorder } from "@/components/interview/audio-recorder";
import { getJob, getSettings, getProfile, getScenariosForJob } from "@/lib/storage/local";
import { getInterviewerSystemPrompt } from "@/lib/ai/prompts";
import { recordUsage } from "@/lib/hooks/use-track-cost";
import type { AIUsage } from "@/lib/ai/client";
import type { ScoreFeedback } from "@/lib/ai/schemas";

interface Message {
  id: string;
  role: "interviewer" | "candidate" | "coach";
  content: string;
}

export default function InterviewChatPage({
  params,
}: {
  params: Promise<{ id: string; scenarioId: string }>;
}) {
  const { id: jobId, scenarioId } = use(params);
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const job = getJob(jobId);
  const scenario = getScenariosForJob(jobId).find((s) => s.id === scenarioId);
  const settings = getSettings();
  const profile = getProfile();

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused) setElapsedSec((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Auto-start first question
  useEffect(() => {
    if (!startedRef.current && job && scenario && settings.apiKey) {
      startedRef.current = true;
      sendToChat([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildSystemPrompt() {
    return getInterviewerSystemPrompt({
      interviewType: scenario?.type || "behavioral",
      targetRole: job?.role || "Software Engineer",
      targetCompany: job?.company || "",
      jobDescription: job?.jobDescription || "",
      difficulty: settings.defaultDifficulty,
      tone: settings.defaultTone,
      mode: "full",
      userProfile: profile.context ? { summary: profile.context } : null,
    });
  }

  async function sendToChat(
    history: Message[],
    extraUserMsg?: string,
    actionPrefix?: string
  ) {
    setIsStreaming(true);

    const conversationMessages = history
      .filter((m) => m.role === "interviewer" || m.role === "candidate")
      .map((m) => ({
        role: (m.role === "interviewer" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      }));

    if (extraUserMsg) {
      const content = actionPrefix ? `${actionPrefix}${extraUserMsg}` : extraUserMsg;
      conversationMessages.push({ role: "user", content });
    }

    if (conversationMessages.length === 0) {
      conversationMessages.push({
        role: "user",
        content: "Please start the interview. Introduce yourself briefly and ask the first question.",
      });
    }

    const tempId = `int-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "interviewer", content: "" },
    ]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiProvider: settings.apiProvider,
          apiKey: settings.apiKey,
          model: settings.model,
          systemPrompt: buildSystemPrompt(),
          messages: conversationMessages,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert(`Chat error: ${err.error || "Unknown error"}`);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              fullText += data.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? { ...m, content: fullText } : m))
              );
            }
            if (data.done) {
              setQuestionCount((c) => c + 1);
              if (data.usage) recordUsage(data.usage as AIUsage, "chat");
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    const candidateMsg: Message = {
      id: `cand-${Date.now()}`,
      role: "candidate",
      content: text,
    };
    const updated = [...messages, candidateMsg];
    setMessages(updated);
    setInput("");

    // Score the answer
    const lastInterviewer = [...messages].reverse().find((m) => m.role === "interviewer");
    if (lastInterviewer) {
      scoreAnswer(lastInterviewer.content, text);
    }

    await sendToChat(updated, text);
  }

  async function scoreAnswer(questionText: string, answerText: string) {
    setIsScoring(true);
    try {
      const res = await fetch("/api/ai/score-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiProvider: settings.apiProvider,
          apiKey: settings.apiKey,
          model: settings.model,
          questionText,
          answerText,
          scenarioType: scenario?.type || "behavioral",
          targetRole: job?.role,
          difficulty: settings.defaultDifficulty,
          profileContext: profile.context,
        }),
      });
      const data = await res.json();
      if (data.feedback) {
        if (data.usage) recordUsage(data.usage as AIUsage, "score-answer");
        const f = data.feedback as ScoreFeedback;
        setMessages((prev) => [
          ...prev,
          {
            id: `coach-${Date.now()}`,
            role: "coach",
            content: `Score: ${f.scores.overall}/10 — ${f.strengths.slice(0, 2).join(", ")}`,
          },
        ]);
      }
    } catch {
      // silent
    } finally {
      setIsScoring(false);
    }
  }

  function handleAction(action: string) {
    if (action === "end") {
      router.push(`/jobs/${jobId}`);
      return;
    }
    const prefixes: Record<string, string> = {
      harder: "[The candidate wants a harder follow-up question] ",
      another: "[The candidate wants to move to a different topic] ",
      ideal: "[Show the ideal answer for the last question, then ask a new one] ",
    };
    sendToChat(messages, "Please continue.", prefixes[action]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (!job || !scenario) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Job or scenario not found.</p>
          <Link href="/jobs">
            <Button variant="outline" size="sm">Back to jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!settings.apiKey) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Set your API key in Settings to start.</p>
          <Link href="/settings">
            <Button variant="outline" size="sm">Go to Settings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/jobs/${jobId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{job.company} — {scenario.title}</p>
            <p className="text-[11px] text-muted-foreground">{job.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono">
            Q{questionCount}
          </Badge>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs font-mono text-muted-foreground hover:text-foreground tabular-nums"
          >
            {formatTime(elapsedSec)}
            {isPaused && <span className="ml-1 text-yellow-500">paused</span>}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === "candidate"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : msg.role === "coach"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 rounded-bl-md text-xs"
                      : "bg-muted border rounded-bl-md"
                }`}
              >
                {msg.role !== "candidate" && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-60">
                    {msg.role === "coach" ? "Coach" : "Interviewer"}
                  </p>
                )}
                {msg.content || (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                  </span>
                )}
              </div>
            </div>
          ))}
          {isScoring && (
            <div className="flex justify-start">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" /> Scoring your answer…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons + input */}
      <div className="border-t px-4 py-3 shrink-0">
        <div className="mx-auto max-w-2xl">
          {/* Actions */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Button
              variant="outline" size="sm"
              className="text-xs gap-1.5 rounded-full h-7 px-3"
              onClick={() => handleAction("harder")}
              disabled={isStreaming}
            >
              <Zap className="h-3 w-3" /> Harder
            </Button>
            <Button
              variant="outline" size="sm"
              className="text-xs gap-1.5 rounded-full h-7 px-3"
              onClick={() => handleAction("another")}
              disabled={isStreaming}
            >
              <SkipForward className="h-3 w-3" /> Next Topic
            </Button>
            <Button
              variant="outline" size="sm"
              className="text-xs gap-1.5 rounded-full h-7 px-3"
              onClick={() => handleAction("ideal")}
              disabled={isStreaming}
            >
              <Star className="h-3 w-3" /> Ideal Answer
            </Button>
            <Button
              variant="outline" size="sm"
              className="text-xs gap-1.5 rounded-full h-7 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              onClick={() => handleAction("end")}
              disabled={isStreaming}
            >
              <Square className="h-3 w-3" /> End
            </Button>
          </div>

          {/* Input row */}
          <div className="flex gap-2">
            <AudioRecorder
              mode="browser"
              apiKey={settings.apiKey}
              onTranscript={(text) => setInput(text)}
              onFinal={(text) => setInput(text)}
              whisperContext={`Job interview for ${job.role} at ${job.company}. ${scenario.type} round.`}
              disabled={isStreaming || isPaused}
            />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isPaused ? "Interview paused…" : "Type your answer… (Enter to send)"}
              disabled={isPaused || isStreaming}
              className="min-h-[56px] max-h-[160px] resize-none text-sm"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming || isPaused}
              size="icon"
              className="shrink-0 self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
