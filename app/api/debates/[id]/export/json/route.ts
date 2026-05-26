import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildJsonExport } from "@/lib/export/json";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: { agents: true, messages: { orderBy: { turn: "asc" } }, analysis: true, socialPost: true }
    });

    if (!debate) {
      return NextResponse.json({ error: "Debate not found." }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(buildJsonExport(debate), null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="ai-arena-${debate.id}.json"`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The export failed. Please try again." }, { status: 500 });
  }
}
