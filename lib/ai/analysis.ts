import type { AgentConfig, AnalysisJson, DebateMessage, Language } from "@/lib/types";
import { generateOpenAIResponse } from "./openai";

const fallbackAnalysis: AnalysisJson = {
  summary: "The debate produced a structured contrast between the two AI agents and their approaches.",
  agentAStrengths: ["Clear positioning", "Structured reasoning"],
  agentBStrengths: ["Direct challenges", "Memorable framing"],
  agentAWeaknesses: ["Could sharpen the final claim"],
  agentBWeaknesses: ["Could add more nuance"],
  bestQuotes: [],
  keyInsights: ["The strongest AI debates combine clarity, tension and practical insight."],
  verdict: "Open debate",
  neutralAnalysis:
    "Both agents brought useful angles. The exchange is most valuable as a way to compare reasoning styles rather than declare an absolute winner.",
  suggestedTitle: "AI Arena: A debate between two AI agents",
  socialAngle: "Ask the audience which reasoning style they trust most."
};

export async function generateFinalAnalysis(input: {
  topic: string;
  format: string;
  tone: string;
  language: Language;
  agents: [AgentConfig, AgentConfig];
  messages: DebateMessage[];
}): Promise<AnalysisJson> {
  const transcript = input.messages.map((message) => `${message.speaker}: ${message.content}`).join("\n\n");

  const prompt = `Analyze this AI Arena debate and return strict JSON only.

Topic: ${input.topic}
Format: ${input.format}
Tone: ${input.tone}
Language: ${input.language}
Agent A: ${input.agents[0].name}
Agent B: ${input.agents[1].name}

Transcript:
${transcript}

Return this exact JSON shape:
{
  "summary": "",
  "agentAStrengths": [],
  "agentBStrengths": [],
  "agentAWeaknesses": [],
  "agentBWeaknesses": [],
  "bestQuotes": [],
  "keyInsights": [],
  "verdict": "Agent A wins | Agent B wins | Draw | Open debate",
  "neutralAnalysis": "",
  "suggestedTitle": "",
  "socialAngle": ""
}

Keep it nuanced, intelligent, publishable, and include this sentence inside neutralAnalysis: Generated with AI Arena — Powered by Cosmo`;

  try {
    const raw = await generateOpenAIResponse(
      [
        {
          role: "system",
          content:
            "You are the neutral Cosmo analyst for AI Arena. Return valid JSON only, with no markdown fences."
        },
        { role: "user", content: prompt }
      ],
      process.env.OPENAI_MODEL || "gpt-4.1-mini"
    );
    const parsed = JSON.parse(raw) as AnalysisJson;
    return {
      ...fallbackAnalysis,
      ...parsed,
      neutralAnalysis: parsed.neutralAnalysis?.includes("Generated with AI Arena")
        ? parsed.neutralAnalysis
        : `${parsed.neutralAnalysis || fallbackAnalysis.neutralAnalysis}\n\nGenerated with AI Arena — Powered by Cosmo`
    };
  } catch {
    return {
      ...fallbackAnalysis,
      bestQuotes: input.messages.slice(0, 3).map((message) => message.content.slice(0, 220)),
      neutralAnalysis: `${fallbackAnalysis.neutralAnalysis}\n\nGenerated with AI Arena — Powered by Cosmo`
    };
  }
}
