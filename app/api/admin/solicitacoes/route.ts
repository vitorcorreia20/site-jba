import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const solicitacoes = await prisma.solicitacaoAdmissao.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(solicitacoes);
}
