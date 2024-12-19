-- CreateTable
CREATE TABLE "Cards" (
    "id" SERIAL NOT NULL,
    "num" INTEGER NOT NULL,
    "buyer" INTEGER NOT NULL,
    "event" INTEGER NOT NULL,
    "nums" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cards_num_key" ON "Cards"("num");

-- CreateIndex
CREATE UNIQUE INDEX "Cards_nums_key" ON "Cards"("nums");
