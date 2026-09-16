import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA") return NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 });
  return null;
}

export async function GET() {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const membros = await prisma.membro.findMany({
    include: { premios: { orderBy: { ordem: "asc" } } },
  });
  // Ordenação numérica por idDemolay (String 5-9 dígitos) — lex order falha para tamanhos diferentes
  membros.sort((a, b) =>
    a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
  );
  return NextResponse.json(membros);
}

const premioSchema = z.object({
  imagemUrl: z.string().url("URL da imagem inválida"),
  legenda: z.string().optional().nullable(),
  ordem: z.coerce.number().int().optional(),
});

const createSchema = z.object({
  idDemolay: z
    .string()
    .trim()
    .min(5, "ID DeMolay deve ter no mínimo 5 caracteres")
    .max(9, "ID DeMolay deve ter no máximo 9 caracteres")
    .regex(/^\d+$/, "ID DeMolay deve conter apenas números"),
  nome: z.string().trim().min(1, "Nome é obrigatório"),
  fotoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  tipo: z.enum(["ATIVO", "DIRETORIA"]).optional(),
  cargoAtual: z.string().optional().nullable(),
  historicoCargos: z.string().optional().nullable(),
  premios: z.array(premioSchema).optional(),
});

export async function POST(request: Request) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const dados = await request.json();
  const parsed = createSchema.safeParse(dados);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: "Dados inválidos", detalhes: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { idDemolay, nome, fotoUrl, tipo, cargoAtual, historicoCargos, premios } = parsed.data;

  try {
    const membro = await prisma.membro.create({
      data: {
        idDemolay,
        nome,
        fotoUrl: fotoUrl || null,
        tipo: tipo === "DIRETORIA" ? "DIRETORIA" : "ATIVO",
        cargoAtual: cargoAtual || null,
        historicoCargos: historicoCargos || null,
        premios: premios && premios.length > 0
          ? {
              create: premios.map((p, idx) => ({
                imagemUrl: p.imagemUrl,
                legenda: p.legenda || null,
                ordem: p.ordem ?? idx,
              })),
            }
          : undefined,
      },
      include: { premios: true },
    });

    return NextResponse.json(membro, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") {
      return NextResponse.json(
        { erro: "Já existe um membro com este ID DeMolay" },
        { status: 409 }
      );
    }
    throw e;
  }
}
