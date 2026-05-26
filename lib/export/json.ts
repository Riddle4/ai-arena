import { parseJsonValue } from "@/lib/utils";

export function buildJsonExport(debate: any) {
  const analysis = debate.analysis
    ? {
        summary: debate.analysis.summary,
        strengthsAgentA: parseJsonValue<string[]>(debate.analysis.agentAStrengths, []),
        strengthsAgentB: parseJsonValue<string[]>(debate.analysis.agentBStrengths, []),
        bestQuotes: parseJsonValue<string[]>(debate.analysis.bestQuotes, []),
        verdict: debate.analysis.verdict,
        neutralAnalysis: debate.analysis.neutralAnalysis
      }
    : null;

  return {
    debate: {
      id: debate.id,
      title: debate.title,
      topic: debate.topic,
      format: debate.format,
      tone: debate.tone,
      language: debate.language,
      createdAt: debate.createdAt,
      poweredBy: "Cosmo"
    },
    agents: debate.agents.map((agent: any) => ({
      name: agent.name,
      provider: agent.provider,
      model: agent.model,
      personality: agent.personality,
      role: agent.role
    })),
    messages: debate.messages.map((message: any) => ({
      turn: message.turn,
      speaker: message.speaker,
      provider: message.provider,
      model: message.model,
      message: message.content
    })),
    analysis,
    socialContent: debate.socialPost
      ? {
          linkedinLong: debate.socialPost.linkedinLong,
          linkedinShort: debate.socialPost.linkedinShort,
          xPost: debate.socialPost.xPost,
          instagramCaption: debate.socialPost.instagram,
          videoScript: debate.socialPost.videoScript,
          carousel: parseJsonValue(debate.socialPost.carousel, [])
        }
      : null,
    branding: {
      product: "AI Arena",
      company: "Cosmo",
      mention: "Generated with AI Arena — Powered by Cosmo"
    }
  };
}
