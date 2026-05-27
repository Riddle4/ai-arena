"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "./CopyButton";
import { DebateMessage } from "./DebateMessage";
import { ExportButtons } from "./ExportButtons";
import { SocialContentPanel } from "./SocialContentPanel";
import { CarouselPreview } from "./CarouselPreview";
import { parseJsonValue } from "@/lib/utils";

const tabs = ["Transcript", "Summary", "Analysis", "Best Quotes", "Social Posts", "Carousel", "Exports"];

export function DebateResultTabs({ debate }: { debate: any }) {
  const [active, setActive] = useState("Transcript");
  const transcript = useMemo(
    () => debate.messages.map((message: any) => `${message.speaker}: ${message.content}`).join("\n\n"),
    [debate.messages]
  );
  const bestQuotes = parseJsonValue<string[]>(debate.analysis?.bestQuotes, []);
  const keyInsights = parseJsonValue<string[]>(debate.analysis?.keyInsights, []);
  const strengthsA = parseJsonValue<string[]>(debate.analysis?.agentAStrengths, []);
  const strengthsB = parseJsonValue<string[]>(debate.analysis?.agentBStrengths, []);
  const weaknessesA = parseJsonValue<string[]>(debate.analysis?.agentAWeaknesses, []);
  const weaknessesB = parseJsonValue<string[]>(debate.analysis?.agentBWeaknesses, []);

  return (
    <section className="glass rounded-lg p-4 md:p-5">
      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-cyan-300/15 pb-3">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition ${
              active === tab ? "cyber-button" : "border border-cyan-300/15 bg-cyan-300/[0.045] text-slate-300 hover:border-fuchsia-300/35 hover:bg-fuchsia-300/[0.08]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Transcript" ? (
        <div className="grid gap-4">
          <CopyButton text={transcript} label="Copy transcript" />
          {debate.messages.map((message: any) => <DebateMessage key={message.id} message={message} />)}
        </div>
      ) : null}

      {active === "Summary" ? (
        <div className="grid gap-4">
          <CopyButton text={debate.analysis?.summary || ""} label="Copy summary" />
          <p className="leading-7 text-slate-200">{debate.analysis?.summary}</p>
          <p className="leading-7 text-slate-300">{debate.analysis?.neutralAnalysis}</p>
        </div>
      ) : null}

      {active === "Analysis" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[
            [`${debate.agents[0]?.name} strengths`, strengthsA],
            [`${debate.agents[1]?.name} strengths`, strengthsB],
            [`${debate.agents[0]?.name} weaknesses`, weaknessesA],
            [`${debate.agents[1]?.name} weaknesses`, weaknessesB],
            ["Key insights", keyInsights],
            ["Verdict", [debate.analysis?.verdict]]
          ].map(([title, items]) => (
            <article key={String(title)} className="soft-border rounded-lg bg-black/35 p-4">
              <h3 className="mb-3 font-semibold text-white">{String(title)}</h3>
              <ul className="grid gap-2 text-sm leading-6 text-slate-300">
                {(items as string[]).filter(Boolean).map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      ) : null}

      {active === "Best Quotes" ? (
        <div className="grid gap-4">
          <CopyButton text={bestQuotes.join("\n")} label="Copy best quotes" />
          {bestQuotes.map((quote) => (
            <blockquote key={quote} className="soft-border rounded-lg bg-black/35 p-4 text-lg leading-8 text-white">
              “{quote}”
            </blockquote>
          ))}
        </div>
      ) : null}

      {active === "Social Posts" ? <SocialContentPanel socialPost={debate.socialPost} /> : null}
      {active === "Carousel" ? <CarouselPreview value={debate.socialPost?.carousel || "[]"} /> : null}
      {active === "Exports" ? <ExportButtons debateId={debate.id} /> : null}
    </section>
  );
}
