import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const dados = await request.json();

  const membro = await prisma.membro.update({
    where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  await prisma.membro.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
