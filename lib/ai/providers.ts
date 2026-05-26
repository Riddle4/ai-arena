import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { ProviderId } from "@/lib/types";
import { generateGrokResponse } from "./grok";
import { generateOpenAIResponse } from "./openai";

export async function generateAgentResponse(
  provider: ProviderId | string,
  messages: ChatCompletionMessageParam[],
  config: { model: string }
) {
  if (provider === "OpenAI") {
    return generateOpenAIResponse(messages, config.model);
  }

  if (provider === "Grok") {
    return generateGrokResponse(messages, config.model);
  }

  throw new Error(`Invalid provider: ${provider}. Only OpenAI and Grok are functional in this MVP.`);
}
