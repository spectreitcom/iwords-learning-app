/*
  Warnings:

  - You are about to drop the `LearnedBox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LearnedBox" DROP CONSTRAINT "LearnedBox_boxId_fkey";

-- DropTable
DROP TABLE "public"."LearnedBox";

-- CreateTable
CREATE TABLE "DailyLearnedBox" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "DailyLearnedBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyLearnedBox" ADD CONSTRAINT "DailyLearnedBox_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE CASCADE ON UPDATE CASCADE;
