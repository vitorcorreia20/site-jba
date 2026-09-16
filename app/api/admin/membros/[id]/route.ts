import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA") return NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 });
  return null;
}

const premioSchema = z.object({
  imagemUrl: z.string().url("URL da imagem inválida"),
  legenda: z.string().optional().nullable(),
  ordem: z.coerce.number().int().optional(),
});

const patchSchema = z.object({
  idDemolay: z
    .string()
    .trim()
    .min(5, "ID DeMolay deve ter no mínimo 5 caracteres")
    .max(9, "ID DeMolay deve ter no máximo 9 caracteres")
    .regex(/^\d+$/, "ID DeMolay deve conter apenas números")
    .optional(),
  nome: z.string().trim().min(1).optional(),
  fotoUrl: z.string().url().optional().or(z.literal("")).nullable().optional(),
  tipo: z.enum(["ATIVO", "DIRETORIA"]).optional(),
  cargoAtual: z.string().optional().nullable(),
  historicoCargos: z.string().optional().nullable(),
  premios: z.array(premioSchema).optional(),
  ativo: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const { id } = await params;
  const dados = await request.json();
  const parsed = patchSchema.safeParse(dados);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: "Dados inválidos", detalhes: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { premios, ...rest } = parsed.data;

  try {
    // Se premios foi enviado, substitui todos (delete + create)
    if (premios !== undefined) {
      await prisma.premio.deleteMany({ where: { membroId: id } });
    }

    const membro = await prisma.membro.update({
      where: { id },
      data: {
        ...(rest.idDemolay !== undefined ? { idDemolay: rest.idDemolay.trim() } : {}),
        ...(rest.nome !== undefined ? { nome: rest.nome } : {}),
        ...(rest.fotoUrl !== undefined ? { fotoUrl: rest.fotoUrl || null } : {}),
        ...(rest.tipo !== undefined ? { tipo: rest.tipo } : {}),
        ...(rest.cargoAtual !== undefined ? { cargoAtual: rest.cargoAtual || null } : {}),
        ...(rest.historicoCargos !== undefined ? { historicoCargos: rest.historicoCargos || null } : {}),
        ...(rest.ativo !== undefined ? { ativo: rest.ativo } : {}),
        ...(premios !== undefined
          ? {
              premios: {
                create: premios.map((p, idx) => ({
                  imagemUrl: p.imagemUrl,
                  legenda: p.legenda || null,
                  ordem: p.ordem ?? idx,
                })),
              },
            }
          : {}),
      },
      include: { premios: { orderBy: { ordem: "asc" } } },
    });

    return NextResponse.json(membro);
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const { id } = await params;
  await prisma.membro.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
