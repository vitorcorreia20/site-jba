import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VISITANTE_COOKIE, type FotoGaleria } from "@/lib/galeria";

const TAKE_PADRAO = 21;
const TAKE_MAXIMO = 48;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const take = Math.min(
    TAKE_MAXIMO,
    Math.max(1, Number.parseInt(searchParams.get("take") ?? String(TAKE_PADRAO), 10) || TAKE_PADRAO)
  );
  const skip = (page - 1) * take;

  const visitanteId = request.cookies.get(VISITANTE_COOKIE)?.value;

  const [total, registros] = await Promise.all([
    prisma.fotoAcao.count(),
    prisma.fotoAcao.findMany({
      orderBy: [{ dataRealizada: "desc" }, { criadoEm: "desc" }, { id: "desc" }],
      skip,
      take,
      include: { _count: { select: { curtidas: true } } },
    }),
  ]);

  let curtidasDoVisitante = new Set<string>();
  if (visitanteId && registros.length > 0) {
    const curtidas = await prisma.curtidaFoto.findMany({
      where: { fotoAcaoId: { in: registros.map((f) => f.id) }, visitanteId },
      select: { fotoAcaoId: true },
    });
    curtidasDoVisitante = new Set(curtidas.map((c) => c.fotoAcaoId));
  }

  const fotos: FotoGaleria[] = registros.map((f) => ({
    id: f.id,
    url: f.url,
    legenda: f.legenda,
    dataRealizada: f.dataRealizada.toISOString(),
    totalCurtidas: f._count.curtidas,
    curtido: curtidasDoVisitante.has(f.id),
  }));

  return NextResponse.json({
    fotos,
    total,
    page,
    take,
    hasMore: skip + registros.length < total,
  });
}
