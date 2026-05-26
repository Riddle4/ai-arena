"use client";

import { Download } from "lucide-react";

export function ExportButtons({ debateId }: { debateId: string }) {
  const exports = [
    ["Export Markdown", "markdown"],
    ["Export JSON", "json"],
    ["Export PDF", "pdf"],
    ["Export DOCX", "docx"]
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {exports.map(([label, format]) => (
        <a
          key={format}
          href={`/api/debates/${debateId}/export/${format}`}
          className="inline-flex items-center gap-2 rounded-md border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
        >
          <Download className="h-4 w-4" />
          {label}
        </a>
      ))}
    </div>
  );
}
