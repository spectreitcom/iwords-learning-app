/*
  Warnings:

  - A unique constraint covering the columns `[expressionContextId,userId]` on the table `Repetition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Repetition_expressionContextId_userId_key" ON "Repetition"("expressionContextId", "userId");
