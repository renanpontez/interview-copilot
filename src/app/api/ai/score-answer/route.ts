import { generateCoachFeedback, type AIConfig } from "@/lib/ai/client";
import { getCoachSystemPrompt } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    apiProvider,
    apiKey,
    questionText,
    answerText,
    scenarioType,
    targetRole,
    difficulty,
    profileContext,
    questionRubric,
  } = body;

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }
  if (!questionText || !answerText) {
    return Response.json(
      { error: "questionText and answerText are required" },
      { status: 400 }
    );
  }

  const config: AIConfig = {
    apiProvider: apiProvider || "openai",
    apiKey,
    model: body.model,
  };

  const coachPrompt = getCoachSystemPrompt(
    profileContext ? { summary: profileContext } : null,
    questionRubric || null
  );

  const context = `Scenario type: ${scenarioType || "behavioral"}, Role: ${targetRole || "Software Engineer"}, Difficulty: ${difficulty || "medium"}`;

  try {
    const { feedback, usage } = await generateCoachFeedback(
      config,
      coachPrompt,
      questionText,
      answerText,
      context
    );
    return Response.json({ feedback, usage });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Scoring failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
