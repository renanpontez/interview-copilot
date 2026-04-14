import { generateCvAnalysis, type AIConfig } from "@/lib/ai/client";
import { getCvAnalysisPrompt } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const { apiProvider, apiKey, model, jobDescription, cvText, profileContext } = body;

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }
  if (!cvText) {
    return Response.json({ error: "CV text is required" }, { status: 400 });
  }

  const config: AIConfig = {
    apiProvider: apiProvider || "openai",
    apiKey,
    model,
  };

  const systemPrompt = getCvAnalysisPrompt({
    jobDescription: jobDescription || "",
    profileContext: profileContext || "",
  });

  try {
    const { analysis, usage } = await generateCvAnalysis(config, systemPrompt, cvText);
    return Response.json({ ...analysis, usage });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "CV analysis failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
