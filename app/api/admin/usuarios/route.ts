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
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }), session: null };
  if (papel !== "DIRETORIA") return { error: NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 }), session: null };
  return { error: null, session };
}

const createSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(100),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72, "Senha muito longa"),
  papel: z.enum(["DIRETORIA", "COMISSAO"], { errorMap: () => ({ message: "Papel deve ser DIRETORIA ou COMISSAO" }) }),
});

export async function GET() {
  const { error } = await requireDiretoria();
  if (error) return error;

  const usuarios = await prisma.adminUser.findMany({
    select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const { error } = await requireDiretoria();
  if (error) return error;

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

  return NextResponse.json(usuario, { status: 201 });
}
