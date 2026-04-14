export interface Profile {
  context: string;
  updatedAt: string;
}

export type JobStatus =
  | "interested"
  | "applied"
  | "screening"
  | "technical"
  | "final"
  | "offer"
  | "closed";

export interface Job {
  id: string;
  company: string;
  role: string;
  jobDescription: string;
  status: JobStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  hasTailoredCv: boolean;
  currentStep?: number;
}

export type ScenarioType =
  | "behavioral"
  | "technical"
  | "system-design"
  | "coding"
  | "culture-fit";

export interface Scenario {
  id: string;
  jobId: string;
  title: string;
  type: ScenarioType;
  questions: string;
  aiSuggestions: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ModelId =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "claude-haiku-4-5-20251001";

export interface AppSettings {
  apiProvider: "openai" | "anthropic";
  apiKey: string;
  model: ModelId;
  defaultDifficulty: "easy" | "medium" | "hard";
  defaultTone: "friendly" | "realistic" | "strict";
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  timestamp: string;
  operation: string;
}

export interface SessionCosts {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalCostUsd: number;
  entries: TokenUsage[];
}
