import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function generateGrokResponse(messages: ChatCompletionMessageParam[], model: string) {
  if (!process.env.XAI_API_KEY) {
    throw new Error("The Grok API key is missing.");
  }

  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1"
  });

  const response = await client.chat.completions.create({
    model: model || "grok-3-mini",
    messages,
    temperature: 0.82,
    max_tokens: 420
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
