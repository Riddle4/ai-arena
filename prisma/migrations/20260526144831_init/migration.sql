-- CreateTable
CREATE TABLE "Debate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "poweredBy" TEXT NOT NULL DEFAULT 'Cosmo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "turn" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "agentAStrengths" TEXT NOT NULL,
    "agentBStrengths" TEXT NOT NULL,
    "agentAWeaknesses" TEXT NOT NULL,
    "agentBWeaknesses" TEXT NOT NULL,
    "bestQuotes" TEXT NOT NULL,
    "keyInsights" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "neutralAnalysis" TEXT NOT NULL,
    "suggestedTitle" TEXT NOT NULL,
    "socialAngle" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "linkedinLong" TEXT NOT NULL,
    "linkedinShort" TEXT NOT NULL,
    "xPost" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "videoScript" TEXT NOT NULL,
    "carousel" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_debateId_key" ON "Analysis"("debateId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialPost_debateId_key" ON "SocialPost"("debateId");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
