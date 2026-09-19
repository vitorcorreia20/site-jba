import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireContatoAccess() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA" && papel !== "COMISSAO")
    return NextResponse.json({ erro: "Acesso restrito" }, { status: 403 });
  return null;
}

export async function GET() {
  const guard = await requireContatoAccess();
  if (guard) return guard;
  const contatos = await prisma.contato.findMany({ orderBy: { criadoEm: "desc" } });
  return NextResponse.json(contatos);
}
