import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA") return NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 });
  return null;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const { id } = await params;
  const foto = await prisma.fotoAcao.findUnique({ where: { id } });
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
