import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMaster } from "@/lib/permissoes";

export const dynamic = "force-dynamic";

const TAKE_MAXIMO = 100;

function rotuloAcao(acao: string) {
  const mapa: Record<string, string> = {
    LOGIN: "Login",
    LOGIN_FALHA: "Falha de login",
    CRIAR: "Criação",
    EDITAR: "Edição",
    REMOVER: "Remoção",
    ALTERAR_STATUS: "Alteração de status",
    UPLOAD: "Upload",
  };
  return mapa[acao] ?? acao;
}

function rotuloEntidade(entidade: string) {
  const mapa: Record<string, string> = {
    sessao: "Sessão",
    foto: "Foto",
    membro: "Membro",
    lideranca: "Liderança",
    solicitacao: "Solicitação",
    contato: "Contato",
    usuario: "Usuário",
    arquivo: "Arquivo",
  };
  return mapa[entidade] ?? entidade;
}

function escaparCsv(valor: string | null) {
  if (valor === null || valor === undefined) return "";
  const s = String(valor).replace(/"/g, '""');
  return /[;"\n]/.test(s) ? `"${s}"` : s;
}

export async function GET(request: Request) {
  const auth = await requireMaster();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const formato = searchParams.get("formato");

  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const take = Math.min(
    formato === "csv" ? 5000 : TAKE_MAXIMO,
    Math.max(1, Number.parseInt(searchParams.get("take") ?? "30", 10) || 30)
  );
  const skip = (page - 1) * take;

  const acao = searchParams.get("acao")?.trim() || undefined;
  const entidade = searchParams.get("entidade")?.trim() || undefined;
  const busca = searchParams.get("busca")?.trim() || undefined;
  const de = searchParams.get("de")?.trim();
  const ate = searchParams.get("ate")?.trim();

  const where: Record<string, unknown> = {};
  if (acao) where.acao = acao;
  if (entidade) where.entidade = entidade;
  if (busca) {
    where.OR = [
      { atorNome: { contains: busca, mode: "insensitive" } },
      { atorEmail: { contains: busca, mode: "insensitive" } },
      { detalhe: { contains: busca, mode: "insensitive" } },
    ];
  }
  const criadoEm: Record<string, Date> = {};
  if (de) {
    const d = new Date(`${de}T00:00:00`);
    if (!isNaN(d.getTime())) criadoEm.gte = d;
  }
  if (ate) {
    const d = new Date(`${ate}T23:59:59`);
    if (!isNaN(d.getTime())) criadoEm.lte = d;
  }
  if (Object.keys(criadoEm).length > 0) where.criadoEm = criadoEm;

  const [total, itens] = await Promise.all([
    prisma.auditoria.count({ where }),
    prisma.auditoria.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      skip,
      take,
    }),
  ]);

  if (formato === "csv") {
    const linhas = [
      "data;ator;email;papel;acao;entidade;detalhe;ip",
      ...itens.map((a) =>
        [
          a.criadoEm.toISOString(),
          escaparCsv(a.atorNome),
          escaparCsv(a.atorEmail),
          escaparCsv(a.atorPapel),
          escaparCsv(rotuloAcao(a.acao)),
          escaparCsv(rotuloEntidade(a.entidade)),
          escaparCsv(a.detalhe),
          escaparCsv(a.ip),
        ].join(";")
      ),
    ];
    return new NextResponse(linhas.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="auditoria-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    itens,
    total,
    page,
    take,
    hasMore: skip + itens.length < total,
  });
}
