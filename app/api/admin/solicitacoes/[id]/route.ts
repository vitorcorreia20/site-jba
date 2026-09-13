import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const dados = await request.json();

  const solicitacao = await prisma.solicitacaoAdmissao.update({
    where: { id: params.id },
    data: {
      status: dados.status,
      notasComissao: dados.notasComissao,
    },
  });

  return NextResponse.json(solicitacao);
}
