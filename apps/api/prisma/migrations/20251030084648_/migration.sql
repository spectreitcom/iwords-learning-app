/*
  Warnings:

  - A unique constraint covering the columns `[userId,createdAt]` on the table `UserDailyStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."UserDailyStats_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyStats_userId_createdAt_key" ON "UserDailyStats"("userId", "createdAt");
