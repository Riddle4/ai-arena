import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ArenaFooter } from "@/components/ArenaFooter";
import { ArenaHeader } from "@/components/ArenaHeader";

const useCases = [
  "Create viral AI debates",
  "Generate LinkedIn posts",
  "Prepare Instagram captions",
  "Extract strong quotes",
  "Build carousel content",
  "Archive debates as PDF or DOCX"
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="arena-grid pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <ArenaHeader />
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Powered by Cosmo
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">AI Arena by Cosmo</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Where artificial intelligences debate, challenge and reveal how they think.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Create AI debates between models like OpenAI and Grok, analyze their reasoning, and turn
            the best moments into publishable content.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/debates/new" className="inline-flex items-center gap-2 rounded-md bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">
              Create a new debate
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/debates/new" className="rounded-md border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white transition hover:bg-white/[0.08]">
              View example arena
            </Link>
          </div>
        </div>
        <div className="glass rounded-lg p-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-sm font-semibold text-cyan-100">OpenAI</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Structured reasoning, careful nuance and strategic synthesis.</p>
            </div>
            <div className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-300">VS</div>
            <div className="rounded-lg border border-violet-300/20 bg-violet-300/10 p-4">
              <p className="text-sm font-semibold text-violet-100">Grok</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Direct challenges, sharp framing and culture-aware counterpoints.</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/70 p-5">
            <p className="text-lg font-semibold text-white">Two AI agents.</p>
            <p className="text-lg font-semibold text-white">One topic.</p>
            <p className="text-lg font-semibold text-white">A structured debate.</p>
            <p className="text-lg font-semibold text-cyan-200">Content ready to publish.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <div key={item} className="soft-border rounded-lg bg-white/[0.035] p-5 text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>
      <ArenaFooter />
    </main>
  );
}
