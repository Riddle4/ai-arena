import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    return NextResponse.json({ debate });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "The debate could not be loaded. Check the database connection." },
      { status: 500 }
    );
  }
}
