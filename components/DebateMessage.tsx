import { AgentBadge } from "./AgentBadge";

export function DebateMessage({ message }: { message: any }) {
  return (
    <article className="soft-border rounded-lg bg-white/[0.035] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <AgentBadge name={message.speaker} provider={message.provider} />
        <span className="text-xs font-semibold text-slate-500">Turn {message.turn}</span>
      </div>
      <p className="whitespace-pre-wrap leading-7 text-slate-200">{message.content}</p>
    </article>
  );
}
