import OpenAI from "openai";
import { addAudio } from "@/lib/audio/audioStore";

let cachedClient: OpenAI | undefined;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("The OpenAI API key is missing.");
  }

  cachedClient ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return cachedClient;
}

export async function generateAgentSpeechMp3(
  text: string,
  options: {
    speakerIndex: 0 | 1;
    language: string;
  }
) {
  const client = getOpenAIClient();
  const voice =
    options.speakerIndex === 0
      ? process.env.OPENAI_TTS_VOICE_AGENT_A || process.env.OPENAI_TTS_VOICE || "marin"
      : process.env.OPENAI_TTS_VOICE_AGENT_B || process.env.OPENAI_TTS_VOICE || "cedar";

  const response = await client.audio.speech.create({
    model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
    voice,
    input: text,
    response_format: "mp3",
    instructions: `Natural, premium, conversational voice. Read clearly in ${options.language}.`
  });

  return addAudio(Buffer.from(await response.arrayBuffer()), "audio/mpeg");
}
