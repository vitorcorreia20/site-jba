import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }), session: null as unknown as NonNullable<typeof session> };
  if (papel !== "DIRETORIA") return { error: NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 }), session: null as unknown as NonNullable<typeof session> };
  return { error: null, session };
}

const patchSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(100).optional(),
  email: z.string().trim().toLowerCase().email("E-mail inválido").optional(),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72).optional(),
  papel: z.enum(["DIRETORIA", "COMISSAO"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireDiretoria();
  if (error) return error;
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

  // Proteções: não rebaixar a si mesmo se for último DIRETORIA
  if (papel !== undefined && existente.email === (session?.user?.email as string | undefined)) {
    if (existente.papel === "DIRETORIA" && papel === "COMISSAO") {
      const totalDiretoria = await prisma.adminUser.count({ where: { papel: "DIRETORIA" } });
      if (totalDiretoria <= 1) {
        return NextResponse.json({ erro: "Não é possível rebaixar o último administrador" }, { status: 400 });
      }
    }
  }
  // Se estiver trocando papel de outro DIRETORIA para COMISSAO e só há 1, bloquear
  if (papel === "COMISSAO" && existente.papel === "DIRETORIA") {
    const totalDiretoria = await prisma.adminUser.count({ where: { papel: "DIRETORIA" } });
    if (totalDiretoria <= 1) {
      return NextResponse.json({ erro: "Deve haver ao menos um administrador (Diretoria)" }, { status: 400 });
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ erro: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const usuario = await prisma.adminUser.update({
    where: { id },
    data: updates,
    select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
  });

  return NextResponse.json(usuario);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireDiretoria();
  if (error) return error;
  const { id } = await params;

  const existente = await prisma.adminUser.findUnique({ where: { id } });
  if (!existente) return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });

  const emailSessao = (session?.user?.email as string | undefined)?.toLowerCase();
  if (emailSessao && existente.email.toLowerCase() === emailSessao) {
    return NextResponse.json({ erro: "Não é possível remover a si mesmo" }, { status: 400 });
  }

  if (existente.papel === "DIRETORIA") {
    const totalDiretoria = await prisma.adminUser.count({ where: { papel: "DIRETORIA" } });
    if (totalDiretoria <= 1) {
      return NextResponse.json({ erro: "Deve haver ao menos um administrador (Diretoria)" }, { status: 400 });
    }
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
