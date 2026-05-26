import { NextResponse } from "next/server";
import { runConversationEngine } from "@/lib/ai/conversationEngine";
import { finalizeDebate, toAgentConfigs } from "@/lib/ai/finalizeDebate";
import { prisma } from "@/lib/db";
import type { DebateConfig } from "@/lib/types";

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

    const agents = toAgentConfigs(debate.agents);

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

    const generated = await prisma.debate.findUniqueOrThrow({
      where: { id: debate.id },
      include: {
        agents: true,
        messages: { orderBy: { turn: "asc" } },
      }
    });

    return NextResponse.json({ debate: await finalizeDebate(generated) });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "The debate could not be generated.";
    return NextResponse.json({ error: message || "The debate could not be generated." }, { status: 500 });
  }
}
