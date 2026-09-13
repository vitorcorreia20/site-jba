import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dados = await request.json();

  const membro = await prisma.membro.update({
    where: { id },
    data: {
      nome: dados.nome,
      fotoUrl: dados.fotoUrl || null,
      tipo: dados.tipo === "DIRETORIA" ? "DIRETORIA" : "ATIVO",
      cargoAtual: dados.cargoAtual || null,
      historicoCargos: dados.historicoCargos || null,
      premios: dados.premios || null,
      ordem: dados.ordem !== undefined ? Number(dados.ordem) : undefined,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : undefined,
    },
  });

  return NextResponse.json(membro);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.membro.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
