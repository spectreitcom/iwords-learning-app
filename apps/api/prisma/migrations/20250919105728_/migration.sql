-- CreateTable
CREATE TABLE "public"."Sentence" (
    "id" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expressionContextId" TEXT NOT NULL,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Sentence" ADD CONSTRAINT "Sentence_expressionContextId_fkey" FOREIGN KEY ("expressionContextId") REFERENCES "public"."ExpressionContext"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
