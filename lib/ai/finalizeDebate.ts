import type { Agent, Debate, Message } from "@prisma/client";
import { generateFinalAnalysis } from "@/lib/ai/analysis";
import { prisma } from "@/lib/db";
import { generateSocialContent } from "@/lib/social/generateSocialContent";
import type { AgentConfig, DebateConfig } from "@/lib/types";
import { toJsonString } from "@/lib/utils";

type DebateWithAgentsAndMessages = Debate & {
  agents: Agent[];
  messages: Message[];
};

export function toAgentConfigs(agents: Agent[]) {
  return agents.map((agent) => ({
    name: agent.name,
    provider: agent.provider,
    model: agent.model,
    personality: agent.personality,
    role: agent.role
  })) as [AgentConfig, AgentConfig];
}

export async function finalizeDebate(debate: DebateWithAgentsAndMessages) {
  const existing = await prisma.debate.findUnique({
    where: { id: debate.id },
    include: {
      agents: true,
      messages: { orderBy: { turn: "asc" } },
      analysis: true,
      socialPost: true
    }
  });

  if (!existing) {
    throw new Error("Debate not found.");
  }

  if (existing.analysis && existing.socialPost) {
    return existing;
  }

  const agents = toAgentConfigs(existing.agents);
  const language = existing.language as DebateConfig["language"];
  const messages = existing.messages.map((message) => ({
    id: message.id,
    debateId: message.debateId,
    speaker: message.speaker,
    provider: message.provider,
    model: message.model,
    turn: message.turn,
    content: message.content,
    createdAt: message.createdAt
  }));
  const analysis = await generateFinalAnalysis({
    topic: existing.topic,
    format: existing.format,
    tone: existing.tone,
    language,
    agents,
    messages
  });
  const social = await generateSocialContent({
    topic: existing.topic,
    messages,
    analysis,
    tone: existing.tone,
    language,
    agents
  });

  await prisma.analysis.upsert({
    where: { debateId: existing.id },
    create: {
      debateId: existing.id,
      summary: analysis.summary,
      agentAStrengths: toJsonString(analysis.agentAStrengths),
      agentBStrengths: toJsonString(analysis.agentBStrengths),
      agentAWeaknesses: toJsonString(analysis.agentAWeaknesses),
      agentBWeaknesses: toJsonString(analysis.agentBWeaknesses),
      bestQuotes: toJsonString(analysis.bestQuotes),
      keyInsights: toJsonString(analysis.keyInsights),
      verdict: analysis.verdict,
      neutralAnalysis: analysis.neutralAnalysis,
      suggestedTitle: analysis.suggestedTitle,
      socialAngle: analysis.socialAngle
    },
    update: {
      summary: analysis.summary,
      agentAStrengths: toJsonString(analysis.agentAStrengths),
      agentBStrengths: toJsonString(analysis.agentBStrengths),
      agentAWeaknesses: toJsonString(analysis.agentAWeaknesses),
      agentBWeaknesses: toJsonString(analysis.agentBWeaknesses),
      bestQuotes: toJsonString(analysis.bestQuotes),
      keyInsights: toJsonString(analysis.keyInsights),
      verdict: analysis.verdict,
      neutralAnalysis: analysis.neutralAnalysis,
      suggestedTitle: analysis.suggestedTitle,
      socialAngle: analysis.socialAngle
    }
  });

  await prisma.socialPost.upsert({
    where: { debateId: existing.id },
    create: {
      debateId: existing.id,
      linkedinLong: social.linkedinLong,
      linkedinShort: social.linkedinShort,
      xPost: social.xPost,
      instagram: social.instagramCaption,
      videoScript: social.videoScript,
      carousel: toJsonString(social.carousel),
      hashtags: toJsonString(social.hashtags)
    },
    update: {
      linkedinLong: social.linkedinLong,
      linkedinShort: social.linkedinShort,
      xPost: social.xPost,
      instagram: social.instagramCaption,
      videoScript: social.videoScript,
      carousel: toJsonString(social.carousel),
      hashtags: toJsonString(social.hashtags)
    }
  });

  return prisma.debate.findUniqueOrThrow({
    where: { id: existing.id },
    include: {
      agents: true,
      messages: { orderBy: { turn: "asc" } },
      analysis: true,
      socialPost: true
    }
  });
}
