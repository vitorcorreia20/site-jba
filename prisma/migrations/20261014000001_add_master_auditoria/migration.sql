-- Adiciona MASTER ao enum PapelAdmin de forma segura dentro de transação
-- (ALTER TYPE ... ADD VALUE não pode rodar em bloco transacional, por isso a dança de tipos)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'PapelAdmin' AND e.enumlabel = 'MASTER'
  ) THEN
    CREATE TYPE "PapelAdmin_new" AS ENUM ('MASTER', 'DIRETORIA', 'COMISSAO');
    ALTER TABLE "AdminUser" ALTER COLUMN "papel" DROP DEFAULT;
    ALTER TABLE "AdminUser" ALTER COLUMN "papel" TYPE "PapelAdmin_new" USING "papel"::text::"PapelAdmin_new";
    ALTER TYPE "PapelAdmin" RENAME TO "PapelAdmin_old";
    ALTER TYPE "PapelAdmin_new" RENAME TO "PapelAdmin";
    DROP TYPE "PapelAdmin_old";
    ALTER TABLE "AdminUser" ALTER COLUMN "papel" SET DEFAULT 'COMISSAO';
  END IF;
END $$;

-- Trilha de auditoria do painel admin
CREATE TABLE IF NOT EXISTS "Auditoria" (
  "id" TEXT NOT NULL,
  "atorId" TEXT,
  "atorNome" TEXT,
  "atorEmail" TEXT,
  "atorPapel" TEXT,
  "acao" TEXT NOT NULL,
  "entidade" TEXT NOT NULL,
  "entidadeId" TEXT,
  "detalhe" TEXT,
  "ip" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Auditoria_criadoEm_idx" ON "Auditoria"("criadoEm");
CREATE INDEX IF NOT EXISTS "Auditoria_acao_idx" ON "Auditoria"("acao");
CREATE INDEX IF NOT EXISTS "Auditoria_entidade_idx" ON "Auditoria"("entidade");
CREATE INDEX IF NOT EXISTS "Auditoria_atorEmail_idx" ON "Auditoria"("atorEmail");
