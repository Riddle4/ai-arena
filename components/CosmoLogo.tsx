import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

export function CosmoLogo() {
  const logoPath = path.join(process.cwd(), "public", "cosmo-logo.png");
  const hasLogo = fs.existsSync(logoPath);

  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-lg border border-cyan-300/30 bg-slate-950">
        {hasLogo ? (
          <Image
            src="/cosmo-logo.png"
            alt="Cosmo logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            unoptimized
          />
        ) : (
          <span className="text-sm font-black text-cyan-100">C</span>
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-400/30 to-violet-500/30" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-wide text-white">Cosmo</p>
        <p className="text-xs text-cyan-200/70">Created by Cosmo</p>
      </div>
    </div>
  );
}
