import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireMaster } from "@/lib/permissoes";
import { registrarAuditoria, atorDeSessao, ipDeHeaders } from "@/lib/auditoria";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(100),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72, "Senha muito longa"),
  papel: z.enum(["MASTER", "DIRETORIA", "COMISSAO"], { errorMap: () => ({ message: "Papel deve ser MASTER, DIRETORIA ou COMISSAO" }) }),
});

export async function GET() {
  const auth = await requireMaster();
  if ("error" in auth) return auth.error;

  const usuarios = await prisma.adminUser.findMany({
    select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const auth = await requireMaster();
  if ("error" in auth) return auth.error;

  let dados: unknown;
  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(dados);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const { nome, email, senha, papel } = parsed.data;
  const emailNormalizado = email.trim().toLowerCase();

  const existente = await prisma.adminUser.findUnique({ where: { email: emailNormalizado } });
  if (existente) {
    return NextResponse.json({ erro: "Já existe um usuário com este e-mail" }, { status: 409 });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.adminUser.create({
    data: { nome: nome.trim(), email: emailNormalizado, senhaHash, papel },
    select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
  });

  await registrarAuditoria({
    ...atorDeSessao(auth.session),
    acao: "CRIAR",
    entidade: "usuario",
    entidadeId: usuario.id,
    detalhe: `Criou usuário ${usuario.email} [${usuario.papel}]`,
    ip: ipDeHeaders(request.headers),
  });

  return NextResponse.json(usuario, { status: 201 });
}
