import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseGestao(periodo: string): number {
  const m = periodo.match(/^(\d{4})\.([12])$/);
  if (m) return Number(m[1]) * 10 + Number(m[2]);
  const y = periodo.match(/\b(19|20)\d{2}\b/);
  if (y) return Number(y[0]) * 10;
  return 0;
}

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA") return NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 });
  return null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const { id } = await params;
  let dados: Record<string, unknown>;
  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (dados.nome !== undefined) {
    const nome = String(dados.nome).trim();
    if (!nome) return NextResponse.json({ erro: "Nome obrigatório" }, { status: 400 });
    updateData.nome = nome;
  }

  if (dados.periodo !== undefined) {
    const periodo = String(dados.periodo).trim();
    if (!/^\d{4}\.[12]$/.test(periodo)) {
      return NextResponse.json(
        { erro: "Período deve ser no formato 2026.1 (AAAA.S com S=1 ou 2). Ex: 2026.1 ou 2026.2" },
        { status: 400 }
      );
    }
    updateData.periodo = periodo;
    updateData.ordem = parseGestao(periodo);
  }

  if (dados.fotoUrl !== undefined) {
    const raw = dados.fotoUrl;
    if (raw === null || raw === "") {
      updateData.fotoUrl = null;
    } else {
      const urlStr = String(raw).trim();
      if (urlStr) {
        try {
          new URL(urlStr);
        } catch {
          return NextResponse.json({ erro: "URL da foto inválida." }, { status: 400 });
        }
      }
      updateData.fotoUrl = urlStr || null;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ erro: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const existente = await prisma.mestreConselheiro.findUnique({ where: { id } });
  if (!existente) return NextResponse.json({ erro: "Mestre não encontrado" }, { status: 404 });

  const atualizado = await prisma.mestreConselheiro.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(atualizado);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const { id } = await params;
  const mestre = await prisma.mestreConselheiro.findUnique({ where: { id } });
  await prisma.mestreConselheiro.delete({ where: { id } });
  if (mestre?.fotoUrl && mestre.fotoUrl.includes("blob.vercel-storage.com")) {
    try {
      await del(mestre.fotoUrl);
    } catch {
      // ignora
    }
  }
  return NextResponse.json({ ok: true });
}
