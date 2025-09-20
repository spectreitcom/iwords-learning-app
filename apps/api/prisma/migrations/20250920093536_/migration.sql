-- DropForeignKey
ALTER TABLE "public"."ExpressionContext" DROP CONSTRAINT "ExpressionContext_expressionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sentence" DROP CONSTRAINT "Sentence_expressionContextId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ExpressionContext" ADD CONSTRAINT "ExpressionContext_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "public"."Expression"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sentence" ADD CONSTRAINT "Sentence_expressionContextId_fkey" FOREIGN KEY ("expressionContextId") REFERENCES "public"."ExpressionContext"("id") ON DELETE CASCADE ON UPDATE CASCADE;
