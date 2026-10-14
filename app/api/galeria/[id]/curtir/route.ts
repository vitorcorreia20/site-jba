import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VISITANTE_COOKIE, cookieVisitanteOptions, novoVisitanteId } from "@/lib/galeria";

function respostaComVisitante(body: object, visitanteId: string, novoCookie: boolean, status = 200) {
  const res = NextResponse.json(body, { status });
  if (novoCookie) {
    res.cookies.set(VISITANTE_COOKIE, visitanteId, cookieVisitanteOptions());
  }
  return res;
}

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const foto = await prisma.fotoAcao.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!foto) {
    return NextResponse.json({ erro: "Foto não encontrada" }, { status: 404 });
  }

  let visitanteId = _request.cookies.get(VISITANTE_COOKIE)?.value;
  let novoCookie = false;
  if (!visitanteId) {
    visitanteId = novoVisitanteId();
    novoCookie = true;
  }

  // 1 curtida por visitante por foto (constraint única); se já curtiu, mantém.
  await prisma.curtidaFoto.upsert({
    where: { fotoAcaoId_visitanteId: { fotoAcaoId: params.id, visitanteId } },
    update: {},
    create: { fotoAcaoId: params.id, visitanteId },
  });

  const total = await prisma.curtidaFoto.count({ where: { fotoAcaoId: params.id } });
  return respostaComVisitante({ curtido: true, total }, visitanteId, novoCookie);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const visitanteId = request.cookies.get(VISITANTE_COOKIE)?.value;
  if (!visitanteId) {
    const total = await prisma.curtidaFoto.count({ where: { fotoAcaoId: params.id } });
    return NextResponse.json({ curtido: false, total });
  }

  await prisma.curtidaFoto.deleteMany({
    where: { fotoAcaoId: params.id, visitanteId },
  });

  const total = await prisma.curtidaFoto.count({ where: { fotoAcaoId: params.id } });
  return NextResponse.json({ curtido: false, total });
}
