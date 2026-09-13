import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const solicitacoes = await prisma.solicitacaoAdmissao.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(solicitacoes);
}
