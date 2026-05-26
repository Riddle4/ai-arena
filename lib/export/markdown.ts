import { parseJsonValue } from "@/lib/utils";

export function buildMarkdownExport(debate: any) {
  const analysis = debate.analysis;
  const social = debate.socialPost;
  const bestQuotes = parseJsonValue<string[]>(analysis?.bestQuotes, []);
  const carousel = parseJsonValue<Array<{ slide: number; title: string; text: string }>>(social?.carousel, []);

  return `# ${debate.title}

Generated with AI Arena — Powered by Cosmo

## Topic

${debate.topic}

## Debate settings

- Format: ${debate.format}
- Tone: ${debate.tone}
- Language: ${debate.language}
- Length: ${debate.length} turns

## Agents

${debate.agents.map((agent: any) => `- ${agent.name} (${agent.provider}, ${agent.model}) — ${agent.personality}; ${agent.role}`).join("\n")}

## Full transcript

${debate.messages.map((message: any) => `### Turn ${message.turn}: ${message.speaker}\n\n${message.content}`).join("\n\n")}

## Final analysis

${analysis?.summary || ""}

${analysis?.neutralAnalysis || ""}

Verdict: ${analysis?.verdict || "Open debate"}

## Best quotes

${bestQuotes.map((quote) => `- "${quote}"`).join("\n")}

## Social media content

### LinkedIn long post

${social?.linkedinLong || ""}

### LinkedIn short post

${social?.linkedinShort || ""}

### X / Twitter post

${social?.xPost || ""}

### Instagram caption

${social?.instagram || ""}

### Short video script

${social?.videoScript || ""}

### Carousel

${carousel.map((slide) => `${slide.slide}. ${slide.title} — ${slide.text}`).join("\n")}
`;
}
