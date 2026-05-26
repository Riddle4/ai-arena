import { NextResponse } from "next/server";
import { generateFinalAnalysis } from "@/lib/ai/analysis";
import { runConversationEngine } from "@/lib/ai/conversationEngine";
import { prisma } from "@/lib/db";
import { generateSocialContent } from "@/lib/social/generateSocialContent";
import type { AgentConfig, DebateConfig } from "@/lib/types";
import { toJsonString } from "@/lib/utils";
import type { Agent } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: { agents: true, messages: true }
    });

    if (!debate) {
      return NextResponse.json({ error: "Debate not found." }, { status: 404 });
    }

    if (debate.messages.length > 0) {
      return NextResponse.json({ error: "This debate has already been generated." }, { status: 409 });
    }

    const agents = debate.agents.map((agent: Agent) => ({
      name: agent.name,
      provider: agent.provider,
      model: agent.model,
      personality: agent.personality,
      role: agent.role
    })) as [AgentConfig, AgentConfig];

    if (agents.some((agent) => !["OpenAI", "Grok"].includes(agent.provider))) {
      return NextResponse.json(
        { error: "Invalid provider. Only OpenAI and Grok are functional in this MVP." },
        { status: 400 }
      );
    }

    const config: DebateConfig = {
      topic: debate.topic,
      format: debate.format,
      tone: debate.tone,
      language: debate.language as DebateConfig["language"],
      length: debate.length,
      agents
    };
    const messages = await runConversationEngine(debate.id, config);

    await prisma.message.createMany({
      data: messages.map((message) => ({
        debateId: debate.id,
        speaker: message.speaker,
        provider: message.provider,
        model: message.model,
        turn: message.turn,
        content: message.content
      }))
    });

    const analysis = await generateFinalAnalysis({
      topic: debate.topic,
      format: debate.format,
      tone: debate.tone,
      language: config.language,
      agents,
      messages
    });
    const social = await generateSocialContent({
      topic: debate.topic,
      messages,
      analysis,
      tone: debate.tone,
      language: config.language,
      agents
    });

    await prisma.analysis.create({
      data: {
        debateId: debate.id,
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

    await prisma.socialPost.create({
      data: {
        debateId: debate.id,
        linkedinLong: social.linkedinLong,
        linkedinShort: social.linkedinShort,
        xPost: social.xPost,
        instagram: social.instagramCaption,
        videoScript: social.videoScript,
        carousel: toJsonString(social.carousel),
        hashtags: toJsonString(social.hashtags)
      }
    });

    const generated = await prisma.debate.findUnique({
      where: { id: debate.id },
      include: {
        agents: true,
        messages: { orderBy: { turn: "asc" } },
        analysis: true,
        socialPost: true
      }
    });

    return NextResponse.json({ debate: generated });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "The debate could not be generated.";
    return NextResponse.json({ error: message || "The debate could not be generated." }, { status: 500 });
  }
}
