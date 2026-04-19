import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Target,
  BarChart3,
  BookOpen,
  Mic,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Realistic Interviews",
    description:
      "AI interviewers that adapt their style — from friendly HR screens to rigorous technical deep-dives.",
  },
  {
    icon: Target,
    title: "Targeted Practice",
    description:
      "Configure by role, company, interview type, and difficulty. Practice what matters for your next interview.",
  },
  {
    icon: BarChart3,
    title: "Detailed Scoring",
    description:
      "Get scored across 8 dimensions including clarity, ownership, technical depth, and communication.",
  },
  {
    icon: Brain,
    title: "Smart Coaching",
    description:
      "Receive actionable feedback, improved answer suggestions, and pattern detection after each answer.",
  },
  {
    icon: Mic,
    title: "Voice Ready",
    description:
      "Practice with text or voice input. Record, review, and submit your answers naturally.",
  },
  {
    icon: BookOpen,
    title: "Question Bank",
    description:
      "Browse 100+ curated questions across HR, behavioral, React, TypeScript, architecture, and more.",
  },
];

const interviewTypes = [
  "HR / Recruiter Screen",
  "Behavioral Interview",
  "Technical Screening",
  "System Design",
  "Project Retrospective",
  "Code Review Discussion",
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            Interview Copilot
          </div>
          <Link href="/dashboard">
            <Button size="sm" className="rounded-full px-5">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered interview practice
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl !leading-[1.1]">
            Practice interviews
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              like the real thing.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Mock interviews that feel authentic. Get scored on clarity,
            ownership, and depth. Receive coaching that actually helps you
            land the role.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25">
                  Try in Browser <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://github.com/renanpontez/interview-copilot-desktop/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 h-12 text-base">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for Mac
                </Button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Desktop app stores data locally in SQLite. No data loss risk.
            </p>
          </div>
        </section>

        {/* Interview Types */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground/70 uppercase mb-8">
              Practice every round
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {interviewTypes.map((type) => (
                <div
                  key={type}
                  className="rounded-full border bg-background px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-primary/5 hover:border-primary/30"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <h2 className="text-center text-3xl font-bold mb-4">
            Everything you need to prepare
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
            From HR screens to system design rounds, get targeted practice with real-time AI feedback.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border shadow-none hover:shadow-md hover:border-primary/20 transition-all duration-200"
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
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
            <h2 className="text-center text-3xl font-bold mb-14">
              How it works
            </h2>
            <div className="grid gap-10 md:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Configure",
                  desc: "Choose interview type, role, difficulty, and tone",
                },
                {
                  step: "2",
                  title: "Practice",
                  desc: "Answer questions from an AI interviewer that adapts to you",
                },
                {
                  step: "3",
                  title: "Get Feedback",
                  desc: "Receive scores, coaching, and improved answer suggestions",
                },
                {
                  step: "4",
                  title: "Improve",
                  desc: "Review patterns, practice weak areas, track your progress",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow-lg shadow-primary/20">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl bg-primary/5 border border-primary/10 p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to ace your next interview?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start practicing now. No account required.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25">
                Start Your First Interview <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 text-center text-sm text-muted-foreground">
          Interview Copilot — Built for serious interview preparation.
        </div>
      </footer>
    </div>
  );
}
