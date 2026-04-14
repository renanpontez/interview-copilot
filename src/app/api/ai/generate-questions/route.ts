import { generateQuestionBank, type AIConfig } from "@/lib/ai/client";
import { getQuestionGenerationPrompt } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    apiProvider,
    apiKey,
    scenarioType,
    targetRole,
    targetCompany,
    jobDescription,
    difficulty,
    profileContext,
    questionCount,
  } = body;

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }

  const config: AIConfig = {
    apiProvider: apiProvider || "openai",
    apiKey,
    model: body.model,
  };

  const systemPrompt = getQuestionGenerationPrompt({
    scenarioType: scenarioType || "behavioral",
    targetRole: targetRole || "Software Engineer",
    targetCompany: targetCompany || "",
    jobDescription: jobDescription || "",
    difficulty: difficulty || "medium",
    profileContext: profileContext || "",
    questionCount,
  });

  try {
    const { questions, usage } = await generateQuestionBank(
      config,
      systemPrompt,
      "Generate the interview questions as specified."
    );
    return Response.json({ ...questions, usage });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Question generation failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
