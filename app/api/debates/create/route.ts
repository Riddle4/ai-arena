import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { DebateConfig } from "@/lib/types";

function cleanAgent(agent: any) {
  return {
    name: String(agent?.name || "").trim(),
    provider: String(agent?.provider || "").trim(),
    model: String(agent?.model || "").trim(),
    personality: String(agent?.personality || "").trim(),
    role: String(agent?.role || "").trim()
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DebateConfig;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: "The debate topic is required." }, { status: 400 });
    }

    const agents = [cleanAgent(body.agents?.[0]), cleanAgent(body.agents?.[1])];
    const debate = await prisma.debate.create({
      data: {
        title: body.topic.trim().slice(0, 88),
        topic: body.topic.trim(),
        format: body.format,
        tone: body.tone,
        language: body.language,
        length: Number(body.length),
        agents: { create: agents }
      },
      include: { agents: true }
    });

    return NextResponse.json({ debate });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "The debate could not be created. Check the database connection." },
      { status: 500 }
    );
  }
}
