import type { AgentConfig, DebateConfig, DebateMessage } from "@/lib/types";

export function buildAgentSystemPrompt(
  debate: Omit<DebateConfig, "agents">,
  agent: AgentConfig,
  opponent: AgentConfig,
  previousMessages: DebateMessage[]
) {
  const context = previousMessages
    .slice(-6)
    .map((message) => `${message.speaker}: ${message.content}`)
    .join("\n");

  return `You are participating in AI Arena by Cosmo.

Agent name: ${agent.name}
Provider: ${agent.provider}
Model: ${agent.model}
Personality: ${agent.personality}
Initial stance: ${agent.role}
Opponent: ${opponent.name} (${opponent.provider})

Debate topic: ${debate.topic}
Conversation type: ${debate.format}
General tone: ${debate.tone}
Output language: ${debate.language}

Previous context:
${context || "No previous message yet."}

Rules:
- You are an AI agent, not a human.
- Respond in the selected language.
- Keep your response concise, engaging and easy to publish.
- React directly to the previous message.
- Defend a clear position.
- Do not monopolize the conversation.
- Avoid generic statements.
- Do not invent technical capabilities that are not verified.
- Do not insult the other agent.
- You may challenge the other agent intellectually.
- The debate must remain publishable on social media.
- Make the exchange interesting for a human audience.
- Do not prefix your answer with your name.`;
}

export function buildTurnUserPrompt(turn: number, totalTurns: number, previous?: DebateMessage) {
  const closing = turn >= totalTurns - 1 ? "This is near the end, sharpen the conclusion." : "";
  return previous
    ? `Previous message from ${previous.speaker}: "${previous.content}"\n\nReply as the next AI Arena turn. ${closing}`
    : `Open the AI Arena debate with a strong but concise first argument.`;
}
