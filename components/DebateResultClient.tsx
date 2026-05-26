"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AgentBadge } from "./AgentBadge";
import { DebateResultTabs } from "./DebateResultTabs";

export function DebateResultClient({ debateId }: { debateId: string }) {
  const searchParams = useSearchParams();
  const shouldGenerate = searchParams.get("generate") === "1";
  const generatedRef = useRef(false);
  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function loadDebate() {
    const response = await fetch(`/api/debates/${debateId}`, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The debate could not be loaded.");
    }

    setDebate(data.debate);
    return data.debate;
  }

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const response = await fetch(`/api/debates/${debateId}/generate`, { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The debate could not be generated.");
      }

      setDebate(data.debate);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "The debate could not be generated.");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    loadDebate()
      .then((loaded) => {
        if (shouldGenerate && loaded.messages.length === 0 && !generatedRef.current) {
          generatedRef.current = true;
          void generate();
        }
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "The debate could not be loaded.");
      })
      .finally(() => setLoading(false));
  }, [debateId, shouldGenerate]);

  if (loading) {
    return <div className="glass rounded-lg p-8 text-slate-300">Loading AI Arena debate...</div>;
  }

  if (!debate) {
    return <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100">{error}</div>;
  }

  return (
    <div className="grid gap-6">
      <section className="glass rounded-lg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              Powered by Cosmo
            </span>
            <h1 className="text-3xl font-semibold text-white md:text-5xl">{debate.title}</h1>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">{debate.topic}</p>
          </div>
          {debate.messages.length === 0 ? (
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              {generating ? "Generating debate..." : "Generate debate"}
            </button>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {debate.agents.map((agent: any) => <AgentBadge key={agent.id} name={agent.name} provider={agent.provider} />)}
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
            {debate.format} · {debate.tone} · {debate.language}
          </span>
        </div>
      </section>

      {generating ? (
        <div className="glass rounded-lg p-6 text-slate-200">
          The AI agents are alternating turns. Analysis and social posts will be generated at the end.
        </div>
      ) : null}

      {error ? <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100">{error}</div> : null}

      {debate.messages.length > 0 ? (
        <DebateResultTabs debate={debate} />
      ) : (
        <div className="glass rounded-lg p-8 text-slate-300">
          The transcript will appear here once the debate is generated.
        </div>
      )}
    </div>
  );
}
