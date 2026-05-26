import Link from "next/link";
import { CosmoLogo } from "./CosmoLogo";

export function ArenaHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5">
      <Link href="/" className="flex items-center gap-4">
        <CosmoLogo />
        <div className="hidden border-l border-white/10 pl-4 sm:block">
          <p className="text-sm font-semibold text-white">AI Arena by Cosmo</p>
          <p className="text-xs text-slate-400">Powered by Cosmo</p>
        </div>
      </Link>
      <Link
        href="/debates/new"
        className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
      >
        Create a new debate
      </Link>
    </header>
  );
}
