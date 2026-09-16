-- CreateEnum
CREATE TYPE "PapelAdmin" AS ENUM ('DIRETORIA', 'COMISSAO');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "papel" "PapelAdmin" NOT NULL DEFAULT 'COMISSAO';

-- AlterTable
ALTER TABLE "SolicitacaoAdmissao" ALTER COLUMN "email" DROP NOT NULL;
