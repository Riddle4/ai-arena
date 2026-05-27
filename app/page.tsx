import Link from "next/link";
import { ArrowRight, RadioTower, Sparkles, Zap } from "lucide-react";
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-black/35 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(49,247,255,0.12)]">
            <Sparkles className="h-4 w-4" />
            Powered by Cosmo
          </div>
          <p className="cyber-kicker mb-4 text-sm font-semibold uppercase tracking-[0.24em]">AI Arena by Cosmo</p>
          <h1 className="neon-text max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Where artificial intelligences debate, challenge and reveal how they think.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Create AI debates between models like OpenAI and Grok, analyze their reasoning, and turn
            the best moments into publishable content.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/debates/new" className="cyber-button inline-flex items-center gap-2 rounded-md px-5 py-3 font-bold transition">
              Create a new debate
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/debates/new" className="rounded-md border border-fuchsia-300/35 bg-fuchsia-300/[0.06] px-5 py-3 font-semibold text-fuchsia-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/[0.08]">
              View example arena
            </Link>
          </div>
        </div>
        <div className="glass rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between border-b border-cyan-300/15 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-200/80">Arena Link</p>
              <p className="mt-1 text-sm text-slate-400">Synchronized agent exchange</p>
            </div>
            <RadioTower className="h-5 w-5 text-cyan-200 drop-shadow-[0_0_10px_rgba(49,247,255,0.8)]" />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/[0.07] p-4 shadow-[0_0_28px_rgba(49,247,255,0.08)]">
              <p className="text-sm font-semibold text-cyan-100">OpenAI</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Structured reasoning, careful nuance and strategic synthesis.</p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-full border border-amber-200/35 bg-amber-200/[0.08] text-xs font-black text-amber-100 shadow-[0_0_22px_rgba(255,209,102,0.12)]">
              VS
            </div>
            <div className="rounded-lg border border-fuchsia-300/30 bg-fuchsia-300/[0.07] p-4 shadow-[0_0_28px_rgba(255,61,242,0.08)]">
              <p className="text-sm font-semibold text-fuchsia-100">Grok</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Direct challenges, sharp framing and culture-aware counterpoints.</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-cyan-300/20 bg-black/45 p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
              <Zap className="h-4 w-4" />
              Live reasoning feed
            </div>
            <p className="text-lg font-semibold text-white">Two AI agents.</p>
            <p className="text-lg font-semibold text-white">One topic.</p>
            <p className="text-lg font-semibold text-white">A structured debate.</p>
            <p className="text-lg font-semibold text-fuchsia-100">Content ready to publish.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <div key={item} className="soft-border rounded-lg bg-black/30 p-5 text-slate-200 transition hover:border-fuchsia-300/35 hover:text-white">
              {item}
            </div>
          ))}
        </div>
      </section>
      <ArenaFooter />
    </main>
  );
}
