import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria, atorDeSessao, ipDeHeaders } from "@/lib/auditoria";

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }) } as const;
  if (papel !== "DIRETORIA" && papel !== "MASTER")
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

  await registrarAuditoria({
    ...atorDeSessao(session),
    acao: "ALTERAR_STATUS",
    entidade: "solicitacao",
    entidadeId: id,
    detalhe: `Solicitação de ${solicitacao.nomeCompleto} → ${solicitacao.status}`,
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json(solicitacao);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireDiretoria();
  if (error) return error;
  const { id } = await params;
  const alvo = await prisma.solicitacaoAdmissao.findUnique({ where: { id }, select: { nomeCompleto: true } });
  await prisma.solicitacaoAdmissao.delete({ where: { id } });

  const session = await getServerSession(authOptions);
  await registrarAuditoria({
    ...atorDeSessao(session),
    acao: "REMOVER",
    entidade: "solicitacao",
    entidadeId: id,
    detalhe: alvo ? `Removeu solicitação de ${alvo.nomeCompleto}` : "Removeu solicitação",
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json({ ok: true });
}
