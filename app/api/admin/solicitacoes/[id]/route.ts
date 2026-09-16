import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  const { id } = await params;
  const dados = await request.json();

  const solicitacao = await prisma.solicitacaoAdmissao.update({
    where: { id },
    data: {
      status: dados.status,
      notasComissao: dados.notasComissao,
    },
  });

  return NextResponse.json(solicitacao);
}
