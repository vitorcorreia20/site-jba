-- CreateEnum
CREATE TYPE "TipoMembro" AS ENUM ('ATIVO', 'DIRETORIA');

-- CreateEnum
CREATE TYPE "StatusAdmissao" AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADO', 'RECUSADO');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membro" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "tipo" "TipoMembro" NOT NULL,
    "cargoAtual" TEXT,
    "historicoCargos" TEXT,
    "premios" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MestreConselheiro" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "periodo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MestreConselheiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitacaoAdmissao" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "responsavel" TEXT,
    "cidade" TEXT NOT NULL,
    "mensagem" TEXT,
    "status" "StatusAdmissao" NOT NULL DEFAULT 'PENDENTE',
    "notasComissao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitacaoAdmissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoAcao" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "legenda" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoAcao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
