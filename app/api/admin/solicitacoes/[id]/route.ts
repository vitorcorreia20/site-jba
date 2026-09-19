import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }) } as const;
  if (papel !== "DIRETORIA")
    return { error: NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 }) } as const;
  return { error: null } as const;
}

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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireDiretoria();
  if (error) return error;
  const { id } = await params;
  await prisma.solicitacaoAdmissao.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
