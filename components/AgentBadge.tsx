export function AgentBadge({ name, provider }: { name: string; provider: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] px-3 py-1 text-xs font-semibold text-cyan-100 shadow-[0_0_18px_rgba(49,247,255,0.08)]">
      <span className="h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_14px_rgba(255,61,242,0.9)]" />
      {name} · {provider}
    </span>
  );
}
