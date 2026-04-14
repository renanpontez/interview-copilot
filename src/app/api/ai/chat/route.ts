import { generateInterviewResponse, estimateCost, type AIConfig } from "@/lib/ai/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { apiProvider, apiKey, model, systemPrompt, messages } = body;

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }

  const config: AIConfig = { apiProvider: apiProvider || "openai", apiKey, model };

  try {
    const result = await generateInterviewResponse(config, systemPrompt, messages);

    const modelId = model || (apiProvider === "anthropic" ? "claude-haiku-4-5-20251001" : "gpt-4o-mini");
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";
        for await (const chunk of result.textStream) {
          fullText += chunk;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
          );
        }
        // Send usage info at the end
        const usage = await result.usage;
        const inputTokens = usage?.inputTokens ?? 0;
        const outputTokens = usage?.outputTokens ?? 0;
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              fullText,
              usage: {
                promptTokens: inputTokens,
                completionTokens: outputTokens,
                modelId,
                estimatedCostUsd: estimateCost(modelId, inputTokens, outputTokens),
              },
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Chat failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
