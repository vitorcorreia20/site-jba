import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMaster } from "@/lib/permissoes";

export const dynamic = "force-dynamic";

function chaveDia(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const auth = await requireMaster();
  if ("error" in auth) return auth.error;

  const ha30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalFotos,
    totalCurtidas,
    curtidas30d,
    membrosAtivos,
    totalMembros,
    contatosPendentes,
    totalContatos,
    solicitacoes,
    usuariosPorPapel,
    topFotos,
    auditoriaRecente,
    logins30d,
  ] = await Promise.all([
    prisma.fotoAcao.count(),
    prisma.curtidaFoto.count(),
    prisma.curtidaFoto.count({ where: { criadoEm: { gte: ha30Dias } } }),
    prisma.membro.count({ where: { ativo: true } }),
    prisma.membro.count(),
    prisma.contato.count({ where: { lido: false } }),
    prisma.contato.count(),
    prisma.solicitacaoAdmissao.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.adminUser.groupBy({ by: ["papel"], _count: { papel: true } }),
    prisma.fotoAcao.findMany({
      select: { id: true, legenda: true, url: true, _count: { select: { curtidas: true } } },
      orderBy: { curtidas: { _count: "desc" } },
      take: 5,
    }),
    prisma.auditoria.findMany({
      select: { criadoEm: true, acao: true },
      where: { criadoEm: { gte: ha30Dias } },
      orderBy: { criadoEm: "asc" },
    }),
    prisma.auditoria.count({ where: { acao: "LOGIN", criadoEm: { gte: ha30Dias } } }),
  ]);

  // Ações por dia (últimos 30 dias) — agregado em JS, volume pequeno
  const porDia: Record<string, number> = {};
  for (const a of auditoriaRecente) {
    const dia = chaveDia(a.criadoEm);
    porDia[dia] = (porDia[dia] ?? 0) + 1;
  }
  const dias: { dia: string; total: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const dia = chaveDia(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
    dias.push({ dia, total: porDia[dia] ?? 0 });
  }
  const pico = Math.max(1, ...dias.map((d) => d.total));

  return NextResponse.json({
    fotos: { total: totalFotos },
    curtidas: { total: totalCurtidas, ultimos30d: curtidas30d },
    membros: { ativos: membrosAtivos, total: totalMembros },
    contatos: { pendentes: contatosPendentes, total: totalContatos },
    solicitacoes: Object.fromEntries(solicitacoes.map((s) => [s.status, s._count.status])),
    usuarios: Object.fromEntries(usuariosPorPapel.map((u) => [u.papel, u._count.papel])),
    topFotos: topFotos.map((f) => ({
      id: f.id,
      legenda: f.legenda,
      url: f.url,
      totalCurtidas: f._count.curtidas,
    })),
    atividade30d: { dias, pico, logins: logins30d, totalAcoes: auditoriaRecente.length },
  });
}
