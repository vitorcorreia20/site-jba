import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

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
  const fotos = await prisma.fotoAcao.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(fotos);
}

export async function POST(request: Request) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const dados = await request.json();

  const foto = await prisma.fotoAcao.create({
    data: {
      url: dados.url,
      legenda: dados.legenda || null,
      ordem: Number(dados.ordem) || 0,
    },
  });

  return NextResponse.json(foto, { status: 201 });
}
