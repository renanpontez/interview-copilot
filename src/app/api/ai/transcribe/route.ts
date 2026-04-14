import OpenAI from "openai";

export async function POST(request: Request) {
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File | null;
  const apiKey = formData.get("apiKey") as string | null;
  const context = formData.get("context") as string | null;

  if (!audioFile) {
    return Response.json({ error: "No audio file provided" }, { status: 400 });
  }
  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: "en",
      temperature: 0,
      // The prompt helps Whisper with jargon, names, and technical terms
      prompt: context || "This is a job interview answer. The speaker may use technical terms related to software engineering, React, TypeScript, Node.js, and system design.",
    });

    return Response.json({ transcript: transcription.text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Transcription failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
