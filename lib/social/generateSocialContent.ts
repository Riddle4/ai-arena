import type { AgentConfig, AnalysisJson, DebateMessage, Language, SocialContent } from "@/lib/types";
import { generateOpenAIResponse } from "@/lib/ai/openai";

function fallbackSocial(topic: string, analysis: AnalysisJson): SocialContent {
  return {
    linkedinLong: `Two AI agents entered AI Arena to debate: ${topic}.\n\nThe strongest insight: ${analysis.keyInsights[0] || analysis.summary}\n\nThis debate was generated with AI Arena, a Cosmo experiment in multi-agent reasoning.\n\nWho won this round?`,
    linkedinShort: `AI Arena by Cosmo asked two AI agents to debate: ${topic}.\n\nKey insight: ${analysis.socialAngle}\n\nWho won this round?`,
    xPost: `Two AI agents debated: ${topic}. The result was less about winning and more about comparing reasoning styles. Generated with AI Arena — Powered by Cosmo.`,
    instagramCaption: `Two AIs. One question. One arena.\n\n${topic}\n\n${analysis.socialAngle}\n\nGenerated with AI Arena — Powered by Cosmo`,
    videoScript: `Hook: Two AI agents debated ${topic}.\nContext: AI Arena by Cosmo turns AI discussions into publishable content.\nAgent A strong point: ${analysis.agentAStrengths[0] || "Structured reasoning"}.\nAgent B strong point: ${analysis.agentBStrengths[0] || "Sharp counterpoints"}.\nWhat it reveals: ${analysis.keyInsights[0] || analysis.summary}.\nCall to vote: Who won this round?`,
    carousel: [
      { slide: 1, title: "Two AIs enter the arena", text: topic },
      { slide: 2, title: "The question", text: topic },
      { slide: 3, title: "Agent A", text: analysis.agentAStrengths[0] || "Structured reasoning" },
      { slide: 4, title: "Agent B", text: analysis.agentBStrengths[0] || "Direct challenge" },
      { slide: 5, title: "The clash", text: analysis.socialAngle },
      { slide: 6, title: "Key insight", text: analysis.keyInsights[0] || analysis.summary },
      { slide: 7, title: "Verdict", text: analysis.verdict },
      { slide: 8, title: "Who won?", text: "Vote in the comments." }
    ],
    hashtags: ["#AIArena", "#Cosmo", "#AI", "#MultiAgent", "#ArtificialIntelligence"],
    suggestedTitle: analysis.suggestedTitle
  };
}

export async function generateSocialContent(input: {
  topic: string;
  messages: DebateMessage[];
  analysis: AnalysisJson;
  tone: string;
  language: Language;
  agents: [AgentConfig, AgentConfig];
}): Promise<SocialContent> {
  const transcript = input.messages.map((message) => `${message.speaker}: ${message.content}`).join("\n\n");
  const fallback = fallbackSocial(input.topic, input.analysis);

  try {
    const raw = await generateOpenAIResponse(
      [
        {
          role: "system",
          content:
            "You generate premium social media content for AI Arena by Cosmo. Return valid JSON only."
        },
        {
          role: "user",
          content: `Generate social content in ${input.language}.
Topic: ${input.topic}
Tone: ${input.tone}
Agents: ${input.agents.map((agent) => `${agent.name} (${agent.provider})`).join(" vs ")}
Cosmo branding: Generated with AI Arena — Powered by Cosmo

Transcript:
${transcript}

Analysis:
${JSON.stringify(input.analysis)}

Return JSON with:
linkedinLong, linkedinShort, xPost, instagramCaption, videoScript, carousel as exactly 8 slides with slide/title/text, hashtags, suggestedTitle.`
        }
      ],
      process.env.OPENAI_MODEL || "gpt-4.1-mini"
    );
    const parsed = JSON.parse(raw) as SocialContent;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}
