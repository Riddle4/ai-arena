import { NextResponse } from "next/server";
import { finalizeDebate } from "@/lib/ai/finalizeDebate";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: {
        agents: true,
        messages: { orderBy: { turn: "asc" } }
      }
    });

    if (!debate) {
      return NextResponse.json({ error: "Debate not found." }, { status: 404 });
    }

    if (debate.messages.length < debate.length) {
      return NextResponse.json({ error: "The debate is not complete yet." }, { status: 400 });
    }

    const finalized = await finalizeDebate(debate);
    return NextResponse.json({ debate: finalized, status: "completed" });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "The debate could not be finalized.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
