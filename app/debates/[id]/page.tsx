import { Suspense } from "react";
import { ArenaFooter } from "@/components/ArenaFooter";
import { ArenaHeader } from "@/components/ArenaHeader";
import { DebateResultClient } from "@/components/DebateResultClient";

export default async function DebatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen">
      <ArenaHeader />
      <section className="mx-auto w-full max-w-7xl px-5 py-10">
        <Suspense fallback={<div className="glass rounded-lg p-8 text-slate-300">Loading arena...</div>}>
          <DebateResultClient debateId={id} />
        </Suspense>
      </section>
      <ArenaFooter result />
    </main>
  );
}
