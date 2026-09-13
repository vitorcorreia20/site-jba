import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const membros = await prisma.membro.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(membros);
}

export async function POST(request: Request) {
  const dados = await request.json();

  const membro = await prisma.membro.create({
    data: {
      nome: dados.nome,
      fotoUrl: dados.fotoUrl || null,
      tipo: dados.tipo === "DIRETORIA" ? "DIRETORIA" : "ATIVO",
      cargoAtual: dados.cargoAtual || null,
      historicoCargos: dados.historicoCargos || null,
      premios: dados.premios || null,
      ordem: Number(dados.ordem) || 0,
    },
  });

  return NextResponse.json(membro, { status: 201 });
}
