import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const fotos = await prisma.fotoAcao.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(fotos);
}

export async function POST(request: Request) {
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
