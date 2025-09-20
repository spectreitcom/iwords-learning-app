/*
  Warnings:

  - You are about to drop the column `sentences` on the `DictionaryReadModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DictionaryReadModel" DROP COLUMN "sentences",
ADD COLUMN     "sentenceIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
