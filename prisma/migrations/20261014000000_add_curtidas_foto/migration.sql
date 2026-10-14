CREATE TABLE IF NOT EXISTS "CurtidaFoto" (
  "id" TEXT NOT NULL,
  "fotoAcaoId" TEXT NOT NULL,
  "visitanteId" TEXT NOT NULL,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CurtidaFoto_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CurtidaFoto_fotoAcaoId_visitanteId_key" ON "CurtidaFoto"("fotoAcaoId", "visitanteId");
CREATE INDEX IF NOT EXISTS "CurtidaFoto_fotoAcaoId_idx" ON "CurtidaFoto"("fotoAcaoId");
CREATE INDEX IF NOT EXISTS "CurtidaFoto_visitanteId_idx" ON "CurtidaFoto"("visitanteId");
DO $$ BEGIN
  ALTER TABLE "CurtidaFoto" ADD CONSTRAINT "CurtidaFoto_fotoAcaoId_fkey" FOREIGN KEY ("fotoAcaoId") REFERENCES "FotoAcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
