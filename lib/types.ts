export type ProviderId =
  | "OpenAI"
  | "Grok"
  | "Claude"
  | "Gemini"
  | "Mistral"
  | "Local Llama"
  | "Custom";

export type Language = "English" | "French";

export type AgentConfig = {
  name: string;
  provider: ProviderId;
  model: string;
  personality: string;
  role: string;
};

export type DebateConfig = {
  topic: string;
  format: string;
  tone: string;
  language: Language;
  length: number;
  agents: [AgentConfig, AgentConfig];
};

export type DebateMessage = {
  id: string;
  debateId: string;
  speaker: string;
  provider: string;
  model: string;
  turn: number;
  content: string;
  createdAt: Date | string;
};

export type AnalysisJson = {
  summary: string;
  agentAStrengths: string[];
  agentBStrengths: string[];
  agentAWeaknesses: string[];
  agentBWeaknesses: string[];
  bestQuotes: string[];
  keyInsights: string[];
  verdict: "Agent A wins" | "Agent B wins" | "Draw" | "Open debate";
  neutralAnalysis: string;
  suggestedTitle: string;
  socialAngle: string;
};

export type CarouselSlide = {
  slide: number;
  title: string;
  text: string;
};

export type SocialContent = {
  linkedinLong: string;
  linkedinShort: string;
  xPost: string;
  instagramCaption: string;
  videoScript: string;
  carousel: CarouselSlide[];
  hashtags: string[];
  suggestedTitle: string;
};
