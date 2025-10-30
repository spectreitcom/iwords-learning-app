-- CreateTable
CREATE TABLE "Repetition" (
    "id" TEXT NOT NULL,
    "expressionContextId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nextRepetition" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repetition_pkey" PRIMARY KEY ("id")
);
