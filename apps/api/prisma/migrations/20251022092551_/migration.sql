-- CreateTable
CREATE TABLE "BoxUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "BoxUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoxUser_userId_boxId_key" ON "BoxUser"("userId", "boxId");

-- AddForeignKey
ALTER TABLE "BoxUser" ADD CONSTRAINT "BoxUser_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE CASCADE ON UPDATE CASCADE;
