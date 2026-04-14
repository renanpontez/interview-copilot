export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function interviewTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hr: "HR / Recruiter",
    behavioral: "Behavioral",
    technical: "Technical Screening",
    "system-design": "System Design",
    "project-retro": "Project Retrospective",
    "code-review": "Code Review Discussion",
    custom: "Custom",
  };
  return labels[type] || type;
}

export function difficultyLabel(diff: string): string {
  return diff.charAt(0).toUpperCase() + diff.slice(1);
}

export function modeLabel(mode: string): string {
  const labels: Record<string, string> = {
    full: "Full Mock Interview",
    single: "Single Question Practice",
    "rapid-fire": "Rapid Fire",
  };
  return labels[mode] || mode;
}
