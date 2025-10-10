-- CreateTable
CREATE TABLE "public"."AnswerExpressionContextReadModel" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "expressionId" TEXT NOT NULL,
    "expressionContextId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "forms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isIrregular" BOOLEAN NOT NULL DEFAULT false,
    "isCountable" BOOLEAN NOT NULL DEFAULT false,
    "sentenceIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "AnswerExpressionContextReadModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnswerSentenceReadModel" (
    "id" TEXT NOT NULL,
    "sentenceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "expressionContextId" TEXT NOT NULL,
    "expressionId" TEXT NOT NULL,

    CONSTRAINT "AnswerSentenceReadModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnswerExpressionContextReadModel_expressionContextId_key" ON "public"."AnswerExpressionContextReadModel"("expressionContextId");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerExpressionContextReadModel_expressionId_expressionCon_key" ON "public"."AnswerExpressionContextReadModel"("expressionId", "expressionContextId");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerSentenceReadModel_sentenceId_key" ON "public"."AnswerSentenceReadModel"("sentenceId");
