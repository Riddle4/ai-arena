export function AgentBadge({ name, provider }: { name: string; provider: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-200">
      <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
      {name} · {provider}
    </span>
  );
}
