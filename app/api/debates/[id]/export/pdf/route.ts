import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildPdfExport } from "@/lib/export/pdf";

export const runtime = "nodejs";

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

    const pdf = await buildPdfExport(debate);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ai-arena-${debate.id}.pdf"`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The export failed. Please try again." }, { status: 500 });
  }
}
