import { NextResponse } from "next/server";
import { getAudio } from "@/lib/audio/audioStore";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ audioId: string }> }) {
  const { audioId } = await params;
  const record = getAudio(audioId);

  if (!record) {
    return NextResponse.json({ error: "Audio not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(record.buffer), {
    headers: {
      "Content-Type": record.contentType,
      "Cache-Control": "no-store"
    }
  });
}
