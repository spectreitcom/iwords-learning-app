/*
  Warnings:

  - You are about to drop the `BoxUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BoxUser" DROP CONSTRAINT "BoxUser_boxId_fkey";

-- DropTable
DROP TABLE "public"."BoxUser";

-- CreateTable
CREATE TABLE "BeginLesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "BeginLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeginLesson_userId_boxId_key" ON "BeginLesson"("userId", "boxId");

-- AddForeignKey
ALTER TABLE "BeginLesson" ADD CONSTRAINT "BeginLesson_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE CASCADE ON UPDATE CASCADE;
