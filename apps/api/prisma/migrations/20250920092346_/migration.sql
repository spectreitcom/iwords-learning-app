/*
  Warnings:

  - A unique constraint covering the columns `[expressionContextId]` on the table `DictionaryReadModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DictionaryReadModel_expressionContextId_key" ON "public"."DictionaryReadModel"("expressionContextId");
