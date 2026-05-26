"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AgentBadge } from "./AgentBadge";
import { DebateResultTabs } from "./DebateResultTabs";

export function DebateResultClient({ debateId }: { debateId: string }) {
  const searchParams = useSearchParams();
  const shouldGenerate = searchParams.get("generate") === "1";
  const generatedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextStepRef = useRef<Promise<StepResponse> | null>(null);
  const liveStatusRef = useRef("idle");
  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [liveStatus, setLiveStatus] = useState("idle");
  const [spokenTurn, setSpokenTurn] = useState(0);
  const [error, setError] = useState("");

  type StepResponse = {
    debate: any;
    audioUrl?: string | null;
    status: "running" | "ready_to_finalize" | "completed";
    currentTurn: number;
    totalTurns: number;
  };

  async function loadDebate() {
    const response = await fetch(`/api/debates/${debateId}`, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The debate could not be loaded.");
    }

    setDebate(data.debate);
    return data.debate;
  }

  async function postJson<T>(url: string) {
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The debate could not continue.");
    }

    return data as T;
  }

  async function finalize() {
    setLiveStatus("finalizing");
    liveStatusRef.current = "finalizing";
    const data = await postJson<{ debate: any; status: string }>(`/api/debates/${debateId}/finalize`);
    setDebate(data.debate);
    setGenerating(false);
    setLiveStatus("completed");
    liveStatusRef.current = "completed";
  }

  function prefetchNextStep() {
    if (nextStepRef.current || liveStatusRef.current !== "running") {
      return;
    }

    nextStepRef.current = postJson<StepResponse>(`/api/debates/${debateId}/step`);
    nextStepRef.current.catch(() => undefined);
  }

  async function playAndContinue(step: StepResponse) {
    setDebate(step.debate);
    setSpokenTurn(step.currentTurn);

    if (step.status === "running") {
      prefetchNextStep();
    }

    const continueAfterAudio = async () => {
      if (step.status === "ready_to_finalize" || step.status === "completed") {
        await finalize();
        return;
      }

      const prefetched = nextStepRef.current;
      nextStepRef.current = null;
      const nextStep = prefetched ? await prefetched : await postJson<StepResponse>(`/api/debates/${debateId}/step`);
      await playAndContinue(nextStep);
    };

    if (!step.audioUrl || !audioRef.current) {
      await continueAfterAudio();
      return;
    }

    audioRef.current.onended = () => {
      void continueAfterAudio().catch((audioError) => {
        setError(audioError instanceof Error ? audioError.message : "The debate could not continue.");
        setGenerating(false);
        setLiveStatus("idle");
      });
    };
    audioRef.current.onerror = () => {
      void continueAfterAudio().catch((audioError) => {
        setError(audioError instanceof Error ? audioError.message : "The debate could not continue.");
        setGenerating(false);
        setLiveStatus("idle");
      });
    };
    audioRef.current.src = step.audioUrl;
    audioRef.current.load();

    try {
      await audioRef.current.play();
    } catch {
      await continueAfterAudio();
    }
  }

  async function generateLive() {
    setGenerating(true);
    setLiveStatus("running");
    liveStatusRef.current = "running";
    setError("");
    nextStepRef.current = null;

    try {
      const firstStep = await postJson<StepResponse>(`/api/debates/${debateId}/step`);
      await playAndContinue(firstStep);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "The debate could not be generated.");
      setGenerating(false);
      setLiveStatus("idle");
      liveStatusRef.current = "idle";
    }
  }

  useEffect(() => {
    loadDebate()
      .then((loaded) => {
        if (shouldGenerate && loaded.messages.length === 0 && !generatedRef.current) {
          generatedRef.current = true;
          void generateLive();
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
      <audio ref={audioRef} className="hidden" preload="auto" />
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
              onClick={generateLive}
              disabled={generating}
              className="rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              {generating ? "Live debate running..." : "Start live debate"}
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
          <p className="font-semibold text-white">
            {liveStatus === "finalizing" ? "Generating analysis and social posts..." : "Live debate in progress"}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            The next agent starts preparing its answer while the current MP3 voiceover is playing.
            {spokenTurn ? ` Turn ${spokenTurn} of ${debate.length} is being read.` : ""}
          </p>
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
