import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const contatoSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome"),
  telefone: z.string().trim().min(8, "Informe um telefone válido"),
  descricao: z.string().trim().min(5, "Descreva sua mensagem").max(1000, "Máximo 1000 caracteres"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contatoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const c = await prisma.contato.create({
      data: {
        nome: parsed.data.nome,
        telefone: parsed.data.telefone,
        descricao: parsed.data.descricao,
      },
    });
    return NextResponse.json({ id: c.id }, { status: 201 });
  } catch (erro) {
    console.error("Erro ao salvar contato", erro);
    return NextResponse.json({ erro: "Não foi possível registrar. Tente novamente." }, { status: 500 });
  }
}
