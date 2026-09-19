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
  const mestres = await prisma.mestreConselheiro.findMany({
    orderBy: { ordem: "asc" },
  });
  return NextResponse.json(mestres);
}

function parseGestao(periodo: string): number {
  const m = periodo.match(/^(\d{4})\.([12])$/);
  if (m) return Number(m[1]) * 10 + Number(m[2]);
  const y = periodo.match(/\b(19|20)\d{2}\b/);
  if (y) return Number(y[0]) * 10;
  return 0;
}

export async function POST(request: Request) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const dados = await request.json();

  const periodo = String(dados.periodo ?? "").trim();
  if (!/^\d{4}\.[12]$/.test(periodo)) {
    return NextResponse.json(
      { erro: "Período deve ser no formato 2026.1 (AAAA.S com S=1 ou 2). Ex: 2026.1 ou 2026.2" },
      { status: 400 }
    );
  }
  const nome = String(dados.nome ?? "").trim();
  if (!nome) return NextResponse.json({ erro: "Nome obrigatório" }, { status: 400 });

  const ordem = parseGestao(periodo);

  const mestre = await prisma.mestreConselheiro.create({
    data: {
      nome,
      fotoUrl: dados.fotoUrl || null,
      periodo,
      ordem,
    },
  });

  return NextResponse.json(mestre, { status: 201 });
}
