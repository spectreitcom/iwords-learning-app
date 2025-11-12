-- CreateTable
CREATE TABLE "LearnedBox" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "LearnedBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LearnedBox" ADD CONSTRAINT "LearnedBox_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE CASCADE ON UPDATE CASCADE;
