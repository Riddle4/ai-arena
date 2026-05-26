"use client";

import type { AgentConfig, ProviderId } from "@/lib/types";

const providers: ProviderId[] = ["OpenAI", "Grok", "Claude", "Gemini", "Mistral", "Local Llama", "Custom"];
const personalities = [
  "Structured",
  "Analytical",
  "Careful",
  "Creative",
  "Direct",
  "Provocative",
  "Humorous",
  "Visionary",
  "Strategic",
  "Pedagogical",
  "Critical"
];
const roles = [
  "Defend its own approach",
  "Stay neutral",
  "Challenge the other agent",
  "Be critical",
  "Be visionary",
  "Be pragmatic"
];

export function AgentConfigCard({
  label,
  agent,
  onChange
}: {
  label: string;
  agent: AgentConfig;
  onChange: (agent: AgentConfig) => void;
}) {
  const update = (key: keyof AgentConfig, value: string) => onChange({ ...agent, [key]: value });

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{label}</h2>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {agent.provider}
        </span>
      </div>
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Agent name
          <input className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={agent.name} onChange={(event) => update("name", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Provider
          <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={agent.provider} onChange={(event) => update("provider", event.target.value)}>
            {providers.map((provider) => <option key={provider}>{provider}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Model
          <input className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={agent.model} onChange={(event) => update("model", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Personality
          <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={agent.personality} onChange={(event) => update("personality", event.target.value)}>
            {personalities.map((personality) => <option key={personality}>{personality}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Initial stance
          <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={agent.role} onChange={(event) => update("role", event.target.value)}>
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}
