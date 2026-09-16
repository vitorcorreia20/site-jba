import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const solicitacaoSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe o nome completo"),
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")).or(z.null()),
  telefone: z.string().min(8, "Informe um WhatsApp válido"),
  responsavel: z.string().optional(),
  cidade: z.string().min(2, "Informe a cidade"),
  mensagem: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = solicitacaoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { erro: "Dados inválidos", detalhes: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const dados = parsed.data;

  try {
    const solicitacao = await prisma.solicitacaoAdmissao.create({
      data: {
        nomeCompleto: dados.nomeCompleto,
        dataNascimento: new Date(dados.dataNascimento),
        email: dados.email?.trim() ? dados.email.trim() : null,
        telefone: dados.telefone,
        responsavel: dados.responsavel || null,
        cidade: dados.cidade,
        mensagem: dados.mensagem || null,
      },
    });

    return NextResponse.json({ id: solicitacao.id }, { status: 201 });
  } catch (erro) {
    console.error("Erro ao salvar solicitação de admissão", erro);
    return NextResponse.json(
      { erro: "Não foi possível registrar a solicitação. Tente novamente." },
      { status: 500 }
    );
  }
}
