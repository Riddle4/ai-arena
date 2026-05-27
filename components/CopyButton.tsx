"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text || "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-fuchsia-300/25 bg-fuchsia-300/[0.06] px-3 py-2 text-xs font-semibold text-fuchsia-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.08]"
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? "Copied to clipboard." : label}
    </button>
  );
}
