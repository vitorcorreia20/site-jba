import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }) };
  const papel = (session.user as unknown as { papel?: string })?.papel;
  return { session, papel };
}

async function requireDiretoria() {
  const auth = await requireAuth();
  if ("error" in auth) return auth;
  if (auth.papel !== "DIRETORIA") return { error: NextResponse.json({ erro: "Apenas Administração pode excluir fotos" }, { status: 403 }) };
  return auth;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const dados = await request.json().catch(() => ({}));

  const update: { url?: string; legenda?: string | null; ordem?: number } = {};

  if (typeof dados.url === "string") {
    const url = dados.url.trim();
    if (!url) return NextResponse.json({ erro: "URL não pode ser vazia" }, { status: 400 });
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ erro: "URL da imagem inválida" }, { status: 400 });
    }
    update.url = url;
  }
  if (typeof dados.legenda === "string" || dados.legenda === null) {
    update.legenda = typeof dados.legenda === "string" ? dados.legenda.trim() || null : null;
  }
  if (dados.ordem !== undefined) {
    update.ordem = Number(dados.ordem) || 0;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ erro: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const existente = await prisma.fotoAcao.findUnique({ where: { id } });
  if (!existente) return NextResponse.json({ erro: "Foto não encontrada" }, { status: 404 });

  const foto = await prisma.fotoAcao.update({ where: { id }, data: update });
  return NextResponse.json(foto);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireDiretoria();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const foto = await prisma.fotoAcao.findUnique({ where: { id } });
  if (!foto) return NextResponse.json({ erro: "Foto não encontrada" }, { status: 404 });
  await prisma.fotoAcao.delete({ where: { id } });
  // best-effort: tenta remover do Blob se for URL do Vercel Blob, senão ignora
  if (foto?.url && foto.url.includes("blob.vercel-storage.com")) {
    try {
      await del(foto.url);
    } catch {
      // ignora falha de delete no blob (ex: já removido, URL externa)
    }
  }
  return NextResponse.json({ ok: true });
}
