-- CreateTable
CREATE TABLE "public"."ExpressionContext" (
    "id" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "isCountable" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "forms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isIrregular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expressionId" TEXT NOT NULL,

    CONSTRAINT "ExpressionContext_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ExpressionContext" ADD CONSTRAINT "ExpressionContext_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "public"."Expression"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
