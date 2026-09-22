import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }) };
  return { session };
}

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const fotos = await prisma.fotoAcao.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(fotos);
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const dados = await request.json();

  const url = typeof dados.url === "string" ? dados.url.trim() : "";
  if (!url) return NextResponse.json({ erro: "URL da imagem é obrigatória" }, { status: 400 });
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ erro: "URL da imagem inválida" }, { status: 400 });
  }

  const foto = await prisma.fotoAcao.create({
    data: {
      url,
      legenda: typeof dados.legenda === "string" ? dados.legenda.trim() || null : null,
      ordem: Number(dados.ordem) || 0,
    },
  });

  return NextResponse.json(foto, { status: 201 });
}
