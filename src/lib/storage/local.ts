"use client";

import type { AppSettings, Job, Profile, Scenario, SessionCosts, TokenUsage } from "./types";

const KEYS = {
  profile: "ic:profile",
  jobs: "ic:jobs",
  scenarios: "ic:scenarios",
  settings: "ic:settings",
  costs: "ic:costs",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getProfile(): Profile {
  return read<Profile>(KEYS.profile, { context: "", updatedAt: "" });
}

export function setProfile(context: string): Profile {
  const next: Profile = { context, updatedAt: new Date().toISOString() };
  write(KEYS.profile, next);
  return next;
}

export function getJobs(): Job[] {
  return read<Job[]>(KEYS.jobs, []);
}

export function getJob(id: string): Job | undefined {
  return getJobs().find((j) => j.id === id);
}

export function saveJob(job: Job): void {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  const next = { ...job, updatedAt: new Date().toISOString() };
  if (idx >= 0) jobs[idx] = next;
  else jobs.unshift(next);
  write(KEYS.jobs, jobs);
}

export function deleteJob(id: string): void {
  write(
    KEYS.jobs,
    getJobs().filter((j) => j.id !== id)
  );
  write(
    KEYS.scenarios,
    getScenarios().filter((s) => s.jobId !== id)
  );
}

export function getScenarios(): Scenario[] {
  return read<Scenario[]>(KEYS.scenarios, []);
}

export function getScenariosForJob(jobId: string): Scenario[] {
  return getScenarios().filter((s) => s.jobId === jobId);
}

export function saveScenario(scenario: Scenario): void {
  const all = getScenarios();
  const idx = all.findIndex((s) => s.id === scenario.id);
  const next = { ...scenario, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = next;
  else all.unshift(next);
  write(KEYS.scenarios, all);
}

export function deleteScenario(id: string): void {
  write(
    KEYS.scenarios,
    getScenarios().filter((s) => s.id !== id)
  );
}

const DEFAULT_SETTINGS: AppSettings = {
  apiProvider: "openai",
  apiKey: "",
  model: "gpt-4o-mini",
  defaultDifficulty: "medium",
  defaultTone: "realistic",
};

export function getSettings(): AppSettings {
  return read<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function setSettings(settings: AppSettings): void {
  write(KEYS.settings, settings);
}

// --- Cost tracking ---

const EMPTY_COSTS: SessionCosts = {
  totalPromptTokens: 0,
  totalCompletionTokens: 0,
  totalCostUsd: 0,
  entries: [],
};

export function getCosts(): SessionCosts {
  return read<SessionCosts>(KEYS.costs, EMPTY_COSTS);
}

export function trackUsage(entry: Omit<TokenUsage, "timestamp">): SessionCosts {
  const costs = getCosts();
  const full: TokenUsage = { ...entry, timestamp: new Date().toISOString() };
  costs.entries.push(full);
  costs.totalPromptTokens += entry.promptTokens;
  costs.totalCompletionTokens += entry.completionTokens;
  costs.totalCostUsd += entry.estimatedCostUsd;
  // Keep last 200 entries to avoid bloating localStorage
  if (costs.entries.length > 200) {
    costs.entries = costs.entries.slice(-200);
  }
  write(KEYS.costs, costs);
  return costs;
}

export function resetCosts(): void {
  write(KEYS.costs, EMPTY_COSTS);
}

export function exportAll(): string {
  return JSON.stringify(
    {
      profile: getProfile(),
      jobs: getJobs(),
      scenarios: getScenarios(),
      settings: getSettings(),
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

export function importAll(json: string): void {
  const data = JSON.parse(json);
  if (data.profile) write(KEYS.profile, data.profile);
  if (data.jobs) write(KEYS.jobs, data.jobs);
  if (data.scenarios) write(KEYS.scenarios, data.scenarios);
  if (data.settings) write(KEYS.settings, data.settings);
}
