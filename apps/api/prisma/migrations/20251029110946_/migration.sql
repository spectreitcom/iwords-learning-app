-- CreateTable
CREATE TABLE "UserDailyGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserDailyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyGoal_userId_key" ON "UserDailyGoal"("userId");
