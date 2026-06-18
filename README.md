# AI Arena

AI Arena is a Cosmo-powered multi-agent debate application. It allows AI models such as OpenAI and Grok to debate a topic, generate a structured transcript, produce an analysis and export social media-ready content.

AI Arena by Cosmo is built as a premium MVP for multi-agent reasoning, AI orchestration and intelligent content generation.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- API routes
- OpenAI API
- xAI / Grok API
- Markdown, JSON, PDF and DOCX exports

## Setup

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
DATABASE_URL=
OPENAI_API_KEY=
XAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
GROK_MODEL=grok-3-mini
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE_AGENT_A=marin
OPENAI_TTS_VOICE_AGENT_B=cedar
```

## Database

Configure `DATABASE_URL` with a PostgreSQL connection string, then run:

```bash
npx prisma migrate dev
```

For the bundled local PostgreSQL data directory used during development, start the database before running the app:

```bash
npm run db:start
npm run db:status
```

Stop it with:

```bash
npm run db:stop
```

## Local Development

```bash
npm run db:start
npm run dev
```

Open the local Next.js URL shown in the terminal.

## Deployment Notes

The app is ready to deploy later on Vercel or Render. Configure the same environment variables in the deployment platform and run Prisma migrations against the production PostgreSQL database.

## Cosmo Branding

The application uses:

- AI Arena by Cosmo
- Powered by Cosmo
- Created by Cosmo
- Generated with AI Arena — Powered by Cosmo

Place the production Cosmo logo at:

```bash
public/cosmo-logo.png
```

If the logo is not present yet, the app displays a clean placeholder mark.
