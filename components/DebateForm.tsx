"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentConfigCard } from "./AgentConfigCard";
import type { AgentConfig, DebateConfig } from "@/lib/types";

const presetTopics = [
  "Who is smarter: OpenAI or Grok?",
  "Will AI replace entrepreneurs?",
  "Should students still learn to code?",
  "Can AI be truly creative?",
  "Will humanoid robots become useful in business?",
  "Is school outdated in the age of AI?",
  "Should companies build AI agents or buy AI tools?",
  "Which matters more: intelligence or reliability?"
];
const formats = [
  "Dialogue",
  "Debate",
  "Duel",
  "Courtroom",
  "Strategic advice",
  "Cross interview",
  "Philosophical discussion",
  "Friendly confrontation"
];
const tones = [
  "Serious",
  "Provocative",
  "Educational",
  "Subtly humorous",
  "Visionary",
  "Philosophical",
  "Business-oriented",
  "Mainstream audience"
];
const lengths = [
  { label: "Short — 6 turns", value: 6 },
  { label: "Medium — 10 turns", value: 10 },
  { label: "Long — 16 turns", value: 16 },
  { label: "Very long — 24 turns", value: 24 }
];

export function DebateForm({
  defaultOpenAIModel,
  defaultGrokModel
}: {
  defaultOpenAIModel: string;
  defaultGrokModel: string;
}) {
  const router = useRouter();
  const defaultA: AgentConfig = {
    name: "OpenAI",
    provider: "OpenAI",
    model: defaultOpenAIModel,
    personality: "Structured",
    role: "Defend its own approach"
  };
  const defaultB: AgentConfig = {
    name: "Grok",
    provider: "Grok",
    model: defaultGrokModel,
    personality: "Provocative",
    role: "Challenge the other agent"
  };
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("Debate");
  const [tone, setTone] = useState("Serious");
  const [length, setLength] = useState(6);
  const [language, setLanguage] = useState<"English" | "French">("English");
  const [agentA, setAgentA] = useState(defaultA);
  const [agentB, setAgentB] = useState(defaultB);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError("The debate topic is required.");
      return;
    }

    setLoading(true);
    const payload: DebateConfig = {
      topic,
      format,
      tone,
      length,
      language,
      agents: [agentA, agentB]
    };

    try {
      const response = await fetch("/api/debates/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The debate could not be created.");
      }

      router.push(`/debates/${data.debate.id}?generate=1`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The debate could not be created.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <section className="glass rounded-lg p-5">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Debate topic
            <textarea
              className="focus-ring min-h-32 rounded-md border border-white/10 bg-slate-950/70 px-3 py-3 text-white"
              placeholder="Who is smarter: OpenAI or Grok?"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {presetTopics.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTopic(preset)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Conversation type
              <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={format} onChange={(event) => setFormat(event.target.value)}>
                {formats.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              General tone
              <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={tone} onChange={(event) => setTone(event.target.value)}>
                {tones.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Debate length
              <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={length} onChange={(event) => setLength(Number(event.target.value))}>
                {lengths.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Language
              <select className="focus-ring rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-white" value={language} onChange={(event) => setLanguage(event.target.value as "English" | "French")}>
                <option>English</option>
                <option>French</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <AgentConfigCard label="Agent A" agent={agentA} onChange={setAgentA} />
        <AgentConfigCard label="Agent B" agent={agentB} onChange={setAgentB} />
      </div>

      {error ? <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
      >
        {loading ? "Creating arena..." : "Launch debate"}
      </button>
    </form>
  );
}
