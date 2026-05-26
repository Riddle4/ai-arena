import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildDocxExport } from "@/lib/export/docx";

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

    const docx = await buildDocxExport(debate);
    return new NextResponse(new Uint8Array(docx), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="ai-arena-${debate.id}.docx"`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The export failed. Please try again." }, { status: 500 });
  }
}
