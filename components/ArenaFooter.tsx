export function ArenaFooter({ result = false }: { result?: boolean }) {
  return (
    <footer className="mx-auto w-full max-w-7xl px-5 py-10 text-sm text-slate-400">
      <div className="soft-border rounded-lg bg-white/[0.03] p-5">
        <p className="font-semibold text-slate-200">
          {result ? "Generated with AI Arena — Powered by Cosmo" : "AI Arena — Powered by Cosmo"}
        </p>
        <p className="mt-2 max-w-3xl">
          AI Arena is a Cosmo experiment in multi-agent reasoning, AI orchestration and intelligent
          content generation.
        </p>
      </div>
    </footer>
  );
}
