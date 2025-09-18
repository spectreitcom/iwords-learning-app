-- CreateTable
CREATE TABLE "public"."Expression" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,

    CONSTRAINT "Expression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expression_phrase_key" ON "public"."Expression"("phrase");
