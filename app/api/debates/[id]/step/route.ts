import { NextResponse } from "next/server";
import { generateConversationTurn } from "@/lib/ai/conversationEngine";
import { toAgentConfigs } from "@/lib/ai/finalizeDebate";
import { generateAgentSpeechMp3 } from "@/lib/ai/tts";
import { prisma } from "@/lib/db";
import type { DebateConfig, DebateMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: {
        agents: true,
        messages: { orderBy: { turn: "asc" } },
        analysis: true,
        socialPost: true
      }
    });

    if (!debate) {
      return NextResponse.json({ error: "Debate not found." }, { status: 404 });
    }

    if (debate.messages.length >= debate.length) {
      return NextResponse.json({
        debate,
        status: debate.analysis && debate.socialPost ? "completed" : "ready_to_finalize",
        totalTurns: debate.length,
        currentTurn: debate.messages.length
      });
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
    const previousMessages: DebateMessage[] = debate.messages.map((message) => ({
      id: message.id,
      debateId: message.debateId,
      speaker: message.speaker,
      provider: message.provider,
      model: message.model,
      turn: message.turn,
      content: message.content,
      createdAt: message.createdAt
    }));
    const nextMessage = await generateConversationTurn(debate.id, config, previousMessages);
    const savedMessage = await prisma.message.create({
      data: {
        debateId: debate.id,
        speaker: nextMessage.speaker,
        provider: nextMessage.provider,
        model: nextMessage.model,
        turn: nextMessage.turn,
        content: nextMessage.content
      }
    });
    const speakerIndex = savedMessage.turn % 2 === 1 ? 0 : 1;
    let audioUrl: string | null = null;

    try {
      const audioId = await generateAgentSpeechMp3(savedMessage.content, {
        speakerIndex,
        language: debate.language
      });
      audioUrl = `/api/audio/${audioId}`;
    } catch (error) {
      console.warn("MP3 generation failed. Continuing with text only.", error);
    }

    const updatedDebate = await prisma.debate.findUniqueOrThrow({
      where: { id: debate.id },
      include: {
        agents: true,
        messages: { orderBy: { turn: "asc" } },
        analysis: true,
        socialPost: true
      }
    });

    return NextResponse.json({
      debate: updatedDebate,
      message: savedMessage,
      audioUrl,
      status: updatedDebate.messages.length >= updatedDebate.length ? "ready_to_finalize" : "running",
      totalTurns: updatedDebate.length,
      currentTurn: updatedDebate.messages.length
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "The debate could not continue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
