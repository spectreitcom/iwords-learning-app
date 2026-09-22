-- CreateTable
CREATE TABLE "MemoryScanLearnedItems" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expressionContextId" UUID NOT NULL,
    "expressionId" UUID NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryScanLearnedItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryScanResults" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "itemsCount" INTEGER NOT NULL,
    "rememberedItemsCount" INTEGER NOT NULL,
    "rememberingTime" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryScanResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemoryScanLearnedItems_userId_createdAt_idx" ON "MemoryScanLearnedItems"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MemoryScanResults_createdAt_userId_idx" ON "MemoryScanResults"("createdAt", "userId");
