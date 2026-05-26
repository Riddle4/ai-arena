import type { AgentConfig, DebateConfig, DebateMessage } from "@/lib/types";
import { buildAgentSystemPrompt, buildTurnUserPrompt } from "./prompts";
import { generateAgentResponse } from "./providers";

export function stripSpeakerPrefix(text: string, agent: AgentConfig) {
  return text
    .replace(new RegExp(`^\\s*${agent.name}\\s*:\\s*`, "i"), "")
    .replace(/^\s*(agent a|agent b|assistant)\s*:\s*/i, "")
    .trim();
}

export async function generateConversationTurn(
  debateId: string,
  config: DebateConfig,
  previousMessages: DebateMessage[]
) {
  const index = previousMessages.length;
  const [agentA, agentB] = config.agents;
  const speakerAgent = index % 2 === 0 ? agentA : agentB;
  const opponent = index % 2 === 0 ? agentB : agentA;
  const previous = previousMessages.at(-1);
  const systemPrompt = buildAgentSystemPrompt(config, speakerAgent, opponent, previousMessages);
  const content = await generateAgentResponse(
    speakerAgent.provider,
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildTurnUserPrompt(index, config.length, previous) }
    ],
    { model: speakerAgent.model }
  );

  return {
    id: crypto.randomUUID(),
    debateId,
    speaker: speakerAgent.name,
    provider: speakerAgent.provider,
    model: speakerAgent.model,
    turn: index + 1,
    content: stripSpeakerPrefix(content, speakerAgent),
    createdAt: new Date()
  };
}

export async function runConversationEngine(debateId: string, config: DebateConfig) {
  const messages: DebateMessage[] = [];

  for (let index = 0; index < config.length; index += 1) {
    messages.push(await generateConversationTurn(debateId, config, messages));
  }

  return messages;
}
