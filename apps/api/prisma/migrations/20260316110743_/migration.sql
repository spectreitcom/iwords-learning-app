-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expressionContextId" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "content" TEXT,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_title_idx" ON "Note"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Note_id_userId_key" ON "Note"("id", "userId");
