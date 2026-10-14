import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireMaster } from "@/lib/permissoes";
import { registrarAuditoria, atorDeSessao, ipDeHeaders } from "@/lib/auditoria";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(100).optional(),
  email: z.string().trim().toLowerCase().email("E-mail inválido").optional(),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72).optional(),
  papel: z.enum(["MASTER", "DIRETORIA", "COMISSAO"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMaster();
  if ("error" in auth) return auth.error;
  const { session } = auth;
  const { id } = await params;

  let dados: unknown;
  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(dados);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const existente = await prisma.adminUser.findUnique({ where: { id } });
  if (!existente) return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });

  const { nome, email, senha, papel } = parsed.data;
  const updates: Record<string, unknown> = {};

  if (nome !== undefined) updates.nome = nome.trim();
  if (papel !== undefined) updates.papel = papel;
  if (senha !== undefined) {
    updates.senhaHash = await bcrypt.hash(senha, 10);
  }
  if (email !== undefined) {
    const emailNormalizado = email.trim().toLowerCase();
    if (emailNormalizado !== existente.email) {
      const conflito = await prisma.adminUser.findUnique({ where: { email: emailNormalizado } });
      if (conflito) return NextResponse.json({ erro: "Já existe um usuário com este e-mail" }, { status: 409 });
      updates.email = emailNormalizado;
    }
  }

  const emailSessao = (session?.user?.email as string | undefined)?.toLowerCase();
  const mexendoConsigo = emailSessao === existente.email.toLowerCase();

  // Proteções do MASTER: nunca rebaixar/remover o último MASTER, nunca mexer em si
  if (papel !== undefined && papel !== "MASTER" && existente.papel === "MASTER") {
    const totalMaster = await prisma.adminUser.count({ where: { papel: "MASTER" } });
    if (totalMaster <= 1) {
      return NextResponse.json({ erro: "Não é possível rebaixar o último Master" }, { status: 400 });
    }
  }
  // Proteções legadas da DIRETORIA
  if (papel === "COMISSAO" && existente.papel === "DIRETORIA") {
    const totalDiretoria = await prisma.adminUser.count({ where: { papel: "DIRETORIA" } });
    if (totalDiretoria <= 1) {
      return NextResponse.json({ erro: "Deve haver ao menos um administrador (Diretoria)" }, { status: 400 });
    }
  }
  if (mexendoConsigo && papel !== undefined && papel !== existente.papel) {
    return NextResponse.json({ erro: "Não é possível alterar o próprio papel" }, { status: 400 });
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ erro: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const usuario = await prisma.adminUser.update({
    where: { id },
    data: updates,
    select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
  });

  await registrarAuditoria({
    ...atorDeSessao(session),
    acao: "EDITAR",
    entidade: "usuario",
    entidadeId: usuario.id,
    detalhe: `Editou usuário ${usuario.email} (campos: ${Object.keys(updates).join(", ")})`,
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json(usuario);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireMaster();
  if ("error" in auth) return auth.error;
  const { session } = auth;
  const { id } = await params;

  const existente = await prisma.adminUser.findUnique({ where: { id } });
  if (!existente) return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });

  const emailSessao = (session?.user?.email as string | undefined)?.toLowerCase();
  if (emailSessao && existente.email.toLowerCase() === emailSessao) {
    return NextResponse.json({ erro: "Não é possível remover a si mesmo" }, { status: 400 });
  }

  if (existente.papel === "MASTER") {
    const totalMaster = await prisma.adminUser.count({ where: { papel: "MASTER" } });
    if (totalMaster <= 1) {
      return NextResponse.json({ erro: "Deve haver ao menos um Master" }, { status: 400 });
    }
  }

  if (existente.papel === "DIRETORIA") {
    const totalDiretoria = await prisma.adminUser.count({ where: { papel: "DIRETORIA" } });
    if (totalDiretoria <= 1) {
      return NextResponse.json({ erro: "Deve haver ao menos um administrador (Diretoria)" }, { status: 400 });
    }
  }

  await prisma.adminUser.delete({ where: { id } });

  await registrarAuditoria({
    ...atorDeSessao(session),
    acao: "REMOVER",
    entidade: "usuario",
    entidadeId: id,
    detalhe: `Removeu usuário ${existente.email} [${existente.papel}]`,
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json({ ok: true });
}
