export interface ScoreBreakdown {
  clarity: number;
  relevance: number;
  ownership: number;
  technicalDepth: number;
  seniority: number;
  communication: number;
  conciseness: number;
  businessAwareness: number;
  overall: number;
}

export interface AnswerFeedback {
  scores: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  tags: string[];
  improvedAnswer: string;
  interviewerConcerns: string[];
  suggestions: string[];
}

export interface SessionSummary {
  overallScore: number;
  strengthsSummary: string;
  weaknessSummary: string;
  repeatedPatterns: string[];
  recommendedPracticeAreas: string[];
  interviewReadiness: "not_ready" | "needs_work" | "almost_ready" | "ready";
  keyInsights: string[];
}

export function calculateOverallScore(
  scores: Omit<ScoreBreakdown, "overall">
): number {
  const weights = {
    clarity: 0.15,
    relevance: 0.15,
    ownership: 0.15,
    technicalDepth: 0.1,
    seniority: 0.1,
    communication: 0.15,
    conciseness: 0.1,
    businessAwareness: 0.1,
  };

  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (scores[key as keyof typeof scores] || 0) * weight;
  }
  return Math.round(total * 10) / 10;
}

export function getScoreLabel(score: number): string {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Strong";
  if (score >= 7) return "Good";
  if (score >= 6) return "Adequate";
  if (score >= 5) return "Needs Improvement";
  if (score >= 4) return "Weak";
  return "Poor";
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600 dark:text-green-400";
  if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export function parseScoreJson(json: string | null): ScoreBreakdown | null {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function parseTags(json: string | null): string[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
