import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function generateOpenAIResponse(messages: ChatCompletionMessageParam[], model: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("The OpenAI API key is missing.");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: model || "gpt-4.1-mini",
    messages,
    temperature: 0.78,
    max_tokens: 420
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
