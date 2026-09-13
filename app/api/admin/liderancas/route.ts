import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mestres = await prisma.mestreConselheiro.findMany({
    orderBy: { ordem: "asc" },
  });
  return NextResponse.json(mestres);
}

export async function POST(request: Request) {
  const dados = await request.json();

  const mestre = await prisma.mestreConselheiro.create({
    data: {
      nome: dados.nome,
      fotoUrl: dados.fotoUrl || null,
      periodo: dados.periodo,
      ordem: Number(dados.ordem) || 0,
    },
  });

  return NextResponse.json(mestre, { status: 201 });
}
