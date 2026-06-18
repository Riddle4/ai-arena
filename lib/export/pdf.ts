import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { parseJsonValue } from "@/lib/utils";

export async function buildPdfExport(debate: any) {
  const chunks: Buffer[] = [];
  const doc = new PDFDocument({ margin: 48, size: "A4" });

  doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fillColor("#0f172a").fontSize(22).text("AI Arena", { continued: true });
  doc.fillColor("#2563eb").fontSize(12).text("  Powered by Cosmo");
  doc.moveDown();
  doc.fillColor("#111827").fontSize(16).text(debate.title);
  doc.fillColor("#4b5563").fontSize(10).text("Generated with AI Arena — Powered by Cosmo");
  doc.moveDown();
  doc.fillColor("#111827").fontSize(12).text(`Topic: ${debate.topic}`);
  doc.text(`Date: ${new Date(debate.createdAt).toLocaleString("en-US")}`);
  doc.text(`Format: ${debate.format} | Tone: ${debate.tone} | Language: ${debate.language}`);
  doc.moveDown();

  doc.fontSize(14).fillColor("#111827").text("Agents");
  debate.agents.forEach((agent: any) => {
    doc.fontSize(10).fillColor("#374151").text(`${agent.name} (${agent.provider}, ${agent.model}) — ${agent.personality}`);
  });
  doc.moveDown();

  doc.fontSize(14).fillColor("#111827").text("Full transcript");
  debate.messages.forEach((message: any) => {
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#1d4ed8").text(`Turn ${message.turn}: ${message.speaker}`);
    doc.fontSize(10).fillColor("#111827").text(message.content, { lineGap: 2 });
  });

  if (debate.analysis) {
    doc.addPage();
    doc.fontSize(14).fillColor("#111827").text("Final analysis");
    doc.fontSize(10).fillColor("#111827").text(debate.analysis.summary);
    doc.moveDown();
    doc.text(debate.analysis.neutralAnalysis);
    doc.moveDown();
    doc.text(`Verdict: ${debate.analysis.verdict}`);
    doc.moveDown();
    doc.fontSize(14).text("Best quotes");
    parseJsonValue<string[]>(debate.analysis.bestQuotes, []).forEach((quote) => {
      doc.fontSize(10).text(`- ${quote}`);
    });
  }

  if (debate.socialPost) {
    doc.addPage();
    doc.fontSize(14).fillColor("#111827").text("Social media content");
    doc.fontSize(11).text("LinkedIn long post");
    doc.fontSize(10).text(debate.socialPost.linkedinLong);
    doc.moveDown();
    doc.fontSize(11).text("Instagram caption");
    doc.fontSize(10).text(debate.socialPost.instagram);
    doc.moveDown();
    doc.fontSize(11).text("Short video script");
    doc.fontSize(10).text(debate.socialPost.videoScript);
  }

  doc.moveDown();
  doc.fontSize(9).fillColor("#6b7280").text(
    "This document was generated with AI Arena, a Cosmo-powered multi-agent debate system.",
    { align: "center" }
  );
  doc.end();

  return done;
}
