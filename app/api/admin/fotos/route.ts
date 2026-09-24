import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }) };
  return { session };
}

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const fotos = await prisma.fotoAcao.findMany({ orderBy: { dataRealizada: "desc" } });
  return NextResponse.json(fotos);
}

function parseDataRealizada(valor: unknown): Date | null {
  if (typeof valor !== "string" || !valor.trim()) return null;
  const str = valor.trim();
  // input date YYYY-MM-DD -> interpreta como meio-dia local para evitar shift UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = new Date(str + "T12:00:00");
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const dados = await request.json();

  const url = typeof dados.url === "string" ? dados.url.trim() : "";
  if (!url) return NextResponse.json({ erro: "URL da imagem é obrigatória" }, { status: 400 });
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ erro: "URL da imagem inválida" }, { status: 400 });
  }

  let dataRealizada = parseDataRealizada(dados.dataRealizada);
  if (!dataRealizada) {
    // se não informado, usa data atual mas o frontend deve alertar que campo é obrigatório
    dataRealizada = new Date();
  }

  const foto = await prisma.fotoAcao.create({
    data: {
      url,
      legenda: typeof dados.legenda === "string" ? dados.legenda.trim() || null : null,
      dataRealizada,
    },
  });

  return NextResponse.json(foto, { status: 201 });
}
