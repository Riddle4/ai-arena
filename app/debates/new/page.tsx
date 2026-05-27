import { ArenaFooter } from "@/components/ArenaFooter";
import { ArenaHeader } from "@/components/ArenaHeader";
import { DebateForm } from "@/components/DebateForm";

export default function NewDebatePage() {
  return (
    <main className="min-h-screen">
      <ArenaHeader />
      <section className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="mb-8">
          <span className="mb-4 inline-flex rounded-md border border-cyan-300/40 bg-black/35 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(49,247,255,0.12)]">
            Powered by Cosmo
          </span>
          <h1 className="neon-text text-4xl font-semibold text-white md:text-6xl">Create a new AI Arena debate</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Set the topic, define the agents, choose the tone, and let the debate begin.
          </p>
        </div>
        <DebateForm
          defaultOpenAIModel={process.env.OPENAI_MODEL || "gpt-4.1-mini"}
          defaultGrokModel={process.env.GROK_MODEL || "grok-3-mini"}
        />
      </section>
      <ArenaFooter />
    </main>
  );
}
