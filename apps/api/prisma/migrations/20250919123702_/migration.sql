-- CreateTable
CREATE TABLE "public"."DictionaryReadModel" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "expressionId" TEXT NOT NULL,
    "expressionContextId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "forms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isIrregular" BOOLEAN NOT NULL DEFAULT false,
    "isCountable" BOOLEAN NOT NULL DEFAULT false,
    "sentences" JSONB,

    CONSTRAINT "DictionaryReadModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DictionaryReadModel_phrase_idx" ON "public"."DictionaryReadModel"("phrase");

-- CreateIndex
CREATE INDEX "DictionaryReadModel_forms_idx" ON "public"."DictionaryReadModel"("forms");

-- CreateIndex
CREATE INDEX "DictionaryReadModel_translation_idx" ON "public"."DictionaryReadModel"("translation");

-- CreateIndex
CREATE INDEX "DictionaryReadModel_type_idx" ON "public"."DictionaryReadModel"("type");

-- CreateIndex
CREATE INDEX "DictionaryReadModel_isIrregular_idx" ON "public"."DictionaryReadModel"("isIrregular");

-- CreateIndex
CREATE INDEX "DictionaryReadModel_isCountable_idx" ON "public"."DictionaryReadModel"("isCountable");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryReadModel_expressionId_expressionContextId_key" ON "public"."DictionaryReadModel"("expressionId", "expressionContextId");
