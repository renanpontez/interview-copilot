"use client";

import { trackUsage } from "@/lib/storage/local";
import type { AIUsage } from "@/lib/ai/client";

/**
 * Track an AI API call's usage in localStorage and notify the header badge.
 */
export function recordUsage(usage: AIUsage, operation: string) {
  trackUsage({
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    estimatedCostUsd: usage.estimatedCostUsd,
    operation,
  });
  // Notify the header cost badge
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ic:cost-updated"));
  }
}
