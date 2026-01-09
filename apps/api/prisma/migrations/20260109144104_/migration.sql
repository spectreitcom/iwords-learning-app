-- CreateTable
CREATE TABLE "BoxRepetitionUserData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLearned" DATE NOT NULL,
    "nextRepetition" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "BoxRepetitionUserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoxDailyRepetition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boxIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,

    CONSTRAINT "BoxDailyRepetition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoxRepetitionUserData_boxId_userId_key" ON "BoxRepetitionUserData"("boxId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoxDailyRepetition_userId_key" ON "BoxDailyRepetition"("userId");
