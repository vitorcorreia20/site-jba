import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  const solicitacoes = await prisma.solicitacaoAdmissao.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(solicitacoes);
}
