import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Target,
  BarChart3,
  Mic,
  Brain,
  Shield,
  Database,
  Sparkles,
  Download,
  CheckCircle2,
} from "lucide-react";

const DOWNLOAD_URL =
  "https://github.com/renanpontez/interview-copilot-desktop/releases/latest";
const GITHUB_URL = "https://github.com/renanpontez/interview-copilot-desktop";

const features = [
  {
    icon: MessageSquare,
    title: "Realistic AI Interviews",
    description:
      "Adaptive interviewers that probe, follow up, and challenge — just like real hiring managers.",
  },
  {
    icon: Target,
    title: "Tailored to Your Role",
    description:
      "Paste the job description, and every question, score, and suggestion is customized to that specific role.",
  },
  {
    icon: BarChart3,
    title: "8-Dimension Scoring",
    description:
      "Clarity, ownership, technical depth, communication, and more — know exactly where to improve.",
  },
  {
    icon: Brain,
    title: "Instant Coaching",
    description:
      "Get improved answer suggestions, signal hit/miss tracking, and actionable feedback after every answer.",
  },
  {
    icon: Mic,
    title: "Voice or Text",
    description:
      "Type or speak your answers. Whisper transcription with real-time preview while you talk.",
  },
  {
    icon: Database,
    title: "CV Analysis",
    description:
      "AI reviews your resume against the JD — highlights strengths, gaps, missing keywords, and reorder suggestions.",
  },
];

const steps = [
  {
    n: "1",
    title: "Add a Job",
    desc: "Paste the job description and company details.",
  },
  {
    n: "2",
    title: "Tailor Your CV",
    desc: "Upload your resume. AI analyzes it against the JD and suggests improvements.",
  },
  {
    n: "3",
    title: "Practice Interviews",
    desc: "Run mock interviews by scenario — behavioral, technical, system design.",
  },
  {
    n: "4",
    title: "Review & Improve",
    desc: "See your scores, track patterns across sessions, and level up.",
  },
];

const trustPoints = [
  { icon: Shield, text: "100% local — your data never leaves your device" },
  { icon: Database, text: "SQLite database — no cloud, no accounts, no data loss" },
  { icon: Sparkles, text: "Bring your own API key — you control the cost" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            Interview Copilot
          </div>
          <div className="flex items-center gap-3">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </Button>
            </a>
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-2 rounded-full px-5">
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Free & open source — runs on your Mac
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl !leading-[1.08]">
            Practice interviews
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              like the real thing.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            AI interviewers that adapt to your role. 8-dimension scoring. CV analysis.
            Voice input. All running locally on your machine — no cloud, no accounts.
          </p>

          {/* Download CTA */}
          <div className="mt-10 flex flex-col items-center gap-5">
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gap-3 rounded-full px-10 h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-shadow"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download for macOS
              </Button>
            </a>
            <p className="text-xs text-muted-foreground">
              macOS 12+ &middot; Apple Silicon & Intel &middot; ~215 MB
            </p>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
              {trustPoints.map((tp) => (
                <div
                  key={tp.text}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <tp.icon className="h-4 w-4 text-primary shrink-0" />
                  {tp.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h2 className="text-center text-3xl font-bold mb-3">
            Everything you need to prepare
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
            One app for every stage — from resume tailoring to mock interviews with AI scoring.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border shadow-none hover:shadow-lg hover:border-primary/20 transition-all duration-200"
              >
                <CardContent className="p-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <h2 className="text-center text-3xl font-bold mb-14">
              How it works
            </h2>
            <div className="grid gap-10 md:grid-cols-4">
              {steps.map((item) => (
                <div key={item.n} className="text-center">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow-lg shadow-primary/20">
                    {item.n}
                  </div>
                  <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BYOK explainer */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold mb-4">
              Bring your own key
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Interview Copilot uses your OpenAI or Anthropic API key. You pay the provider directly — typically less than $0.05 per full mock interview.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { model: "GPT-4o Mini", cost: "~$0.02/interview", note: "Fast, cheap, good enough" },
                { model: "GPT-4o", cost: "~$0.15/interview", note: "Higher quality scoring" },
                { model: "Claude Haiku 4.5", cost: "~$0.05/interview", note: "Great alternative" },
              ].map((m) => (
                <Card key={m.model} className="text-center">
                  <CardContent className="p-5">
                    <p className="font-semibold text-sm mb-1">{m.model}</p>
                    <p className="text-2xl font-bold text-primary mb-1">{m.cost}</p>
                    <p className="text-xs text-muted-foreground">{m.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl bg-primary/5 border border-primary/10 p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to ace your next interview?
            </h2>
            <p className="text-muted-foreground mb-8">
              Download the app. Set your API key. Start practicing in under a minute.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="gap-3 rounded-full px-10 h-14 text-base font-semibold shadow-xl shadow-primary/20"
                >
                  <Download className="h-5 w-5" />
                  Download for macOS
                </Button>
              </a>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> Free forever
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> Open source
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> No account needed
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Interview Copilot — Free & open source</span>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href={`${GITHUB_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Report Issue
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
