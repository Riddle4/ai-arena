import { Document, Packer, Paragraph, TextRun } from "docx";
import { parseJsonValue } from "@/lib/utils";

function heading(text: string) {
  return new Paragraph({
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, bold: true, size: 30 })]
  });
}

function paragraph(text: string) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22 })]
  });
}

export async function buildDocxExport(debate: any) {
  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: "AI Arena", bold: true, size: 40 })] }),
    paragraph("Powered by Cosmo"),
    paragraph("Generated with AI Arena — Powered by Cosmo"),
    heading("Topic"),
    paragraph(debate.topic),
    heading("Debate configuration"),
    paragraph(`Format: ${debate.format}`),
    paragraph(`Tone: ${debate.tone}`),
    paragraph(`Language: ${debate.language}`),
    paragraph(`Length: ${debate.length} turns`),
    heading("Agents"),
    ...debate.agents.map((agent: any) =>
      paragraph(`${agent.name} (${agent.provider}, ${agent.model}) — ${agent.personality}; ${agent.role}`)
    ),
    heading("Full transcript"),
    ...debate.messages.flatMap((message: any) => [
      paragraph(`Turn ${message.turn}: ${message.speaker}`),
      paragraph(message.content)
    ])
  ];

  if (debate.analysis) {
    children.push(
      heading("Final analysis"),
      paragraph(debate.analysis.summary),
      paragraph(debate.analysis.neutralAnalysis),
      paragraph(`Verdict: ${debate.analysis.verdict}`),
      heading("Best quotes"),
      ...parseJsonValue<string[]>(debate.analysis.bestQuotes, []).map((quote) => paragraph(`- ${quote}`))
    );
  }

  if (debate.socialPost) {
    children.push(
      heading("Social media content"),
      paragraph("LinkedIn long post"),
      paragraph(debate.socialPost.linkedinLong),
      paragraph("LinkedIn short post"),
      paragraph(debate.socialPost.linkedinShort),
      paragraph("X / Twitter post"),
      paragraph(debate.socialPost.xPost),
      paragraph("Instagram caption"),
      paragraph(debate.socialPost.instagram),
      paragraph("Short video script"),
      paragraph(debate.socialPost.videoScript)
    );
  }

  children.push(paragraph("This document was generated with AI Arena, a Cosmo-powered multi-agent debate system."));

  const document = new Document({ sections: [{ children }] });
  return Packer.toBuffer(document);
}
