import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria, atorDeSessao, ipDeHeaders } from "@/lib/auditoria";

async function requireContatoAccess() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA" && papel !== "COMISSAO" && papel !== "MASTER")
    return NextResponse.json({ erro: "Acesso restrito" }, { status: 403 });
  return null;
}

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA" && papel !== "MASTER") return NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 });
  return null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireContatoAccess();
  if (guard) return guard;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const data: Record<string, boolean> = {};
  if (typeof body.lido === "boolean") data.lido = body.lido;
  if (typeof body.realizado === "boolean") data.realizado = body.realizado;
  // compat: se lido vier como truthy sem ser boolean estrito, tenta converter
  if (typeof body.lido !== "boolean" && "lido" in body) data.lido = !!body.lido;
  if (typeof body.realizado !== "boolean" && "realizado" in body) data.realizado = !!body.realizado;
  if (Object.keys(data).length === 0) return NextResponse.json({ erro: "Nada a atualizar" }, { status: 400 });
  const contato = await prisma.contato.update({ where: { id }, data });

  const session = await getServerSession(authOptions);
  await registrarAuditoria({
    ...atorDeSessao(session),
    acao: "EDITAR",
    entidade: "contato",
    entidadeId: id,
    detalhe: `Atualizou contato de ${contato.nome} (${Object.keys(data).join(", ")})`,
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json(contato);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const { id } = await params;
  const alvo = await prisma.contato.findUnique({ where: { id }, select: { nome: true } });
  await prisma.contato.delete({ where: { id } });

  const session = await getServerSession(authOptions);
  await registrarAuditoria({
    ...atorDeSessao(session),
    acao: "REMOVER",
    entidade: "contato",
    entidadeId: id,
    detalhe: alvo ? `Removeu contato de ${alvo.nome}` : "Removeu contato",
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json({ ok: true });
}
