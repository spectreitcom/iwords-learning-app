/*
  Warnings:

  - You are about to drop the `BeginLesson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BeginLesson" DROP CONSTRAINT "BeginLesson_boxId_fkey";

-- DropTable
DROP TABLE "public"."BeginLesson";

-- CreateTable
CREATE TABLE "BeginBox" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "BeginBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeginBox_userId_boxId_key" ON "BeginBox"("userId", "boxId");

-- AddForeignKey
ALTER TABLE "BeginBox" ADD CONSTRAINT "BeginBox_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE CASCADE ON UPDATE CASCADE;
