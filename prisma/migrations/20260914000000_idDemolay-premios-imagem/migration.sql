-- AlterTable
ALTER TABLE "Membro" DROP COLUMN "ordem",
DROP COLUMN "premios",
ADD COLUMN     "idDemolay" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Premio" (
    "id" TEXT NOT NULL,
    "membroId" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "legenda" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Premio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Premio_membroId_idx" ON "Premio"("membroId");

-- CreateIndex
CREATE UNIQUE INDEX "Membro_idDemolay_key" ON "Membro"("idDemolay");

-- AddForeignKey
ALTER TABLE "Premio" ADD CONSTRAINT "Premio_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
