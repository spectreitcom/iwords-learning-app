-- CreateTable
CREATE TABLE "public"."Box" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expressionContextIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);
