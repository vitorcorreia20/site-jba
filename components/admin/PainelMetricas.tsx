"use client";

import { useEffect, useState } from "react";

type Metricas = {
  fotos: { total: number };
  curtidas: { total: number; ultimos30d: number };
  membros: { ativos: number; total: number };
  contatos: { pendentes: number; total: number };
  solicitacoes: Record<string, number>;
  usuarios: Record<string, number>;
  topFotos: { id: string; legenda: string | null; url: string; totalCurtidas: number }[];
  atividade30d: { dias: { dia: string; total: number }[]; pico: number; logins: number; totalAcoes: number };
};

function Cartao({ titulo, valor, detalhe }: { titulo: string; valor: string | number; detalhe?: string }) {
  return (
    <div className="rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper)] px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]/40">{titulo}</p>
      <p className="mt-1 font-display text-3xl font-black text-[var(--crimson)]">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-[var(--ink)]/50">{detalhe}</p>}
    </div>
  );
}

export default function PainelMetricas() {
  const [dados, setDados] = useState<Metricas | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/metricas")
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.erro || "Erro ao carregar métricas");
        return json;
      })
      .then(setDados)
      .catch((e) => setErro(e.message));
  }, []);

  if (erro) {
    return <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>;
  }
  if (!dados) {
    return <p className="text-sm text-[var(--ink)]/40">Carregando métricas…</p>;
  }

  const solicitacoesTotal = Object.values(dados.solicitacoes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Cartao titulo="Fotos publicadas" valor={dados.fotos.total} />
        <Cartao
          titulo="Curtidas"
          valor={dados.curtidas.total}
          detalhe={`+${dados.curtidas.ultimos30d} nos últimos 30 dias`}
        />
        <Cartao
          titulo="Membros ativos"
          valor={dados.membros.ativos}
          detalhe={`${dados.membros.total} cadastrados no total`}
        />
        <Cartao
          titulo="Contatos pendentes"
          valor={dados.contatos.pendentes}
          detalhe={`${dados.contatos.total} mensagens no total`}
        />
        <Cartao
          titulo="Solicitações"
          valor={solicitacoesTotal}
          detalhe={Object.entries(dados.solicitacoes).map(([k, v]) => `${k}: ${v}`).join(" · ") || "nenhuma"}
        />
        <Cartao
          titulo="Ações auditadas (30d)"
          valor={dados.atividade30d.totalAcoes}
          detalhe={`${dados.atividade30d.logins} logins no período`}
        />
        <Cartao
          titulo="Usuários Master"
          valor={dados.usuarios.MASTER ?? 0}
          detalhe={`Administração: ${dados.usuarios.DIRETORIA ?? 0} · Gestor: ${dados.usuarios.COMISSAO ?? 0}`}
        />
      </div>

      {/* atividade 30 dias */}
      <div className="rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper)] p-4">
        <h3 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Atividade dos últimos 30 dias</h3>
        <p className="text-xs text-[var(--ink)]/40">Ações registradas na auditoria por dia (logins, criações, edições, remoções).</p>
        <div className="mt-4 flex h-28 items-end gap-1" role="img" aria-label={`Gráfico de atividade: pico de ${dados.atividade30d.pico} ações em um dia`}>
          {dados.atividade30d.dias.map((d) => (
            <div
              key={d.dia}
              title={`${d.dia}: ${d.total}`}
              className="min-w-0 flex-1 rounded-t bg-[var(--crimson)]/80 hover:bg-[var(--crimson)]"
              style={{ height: `${Math.max(4, (d.total / dados.atividade30d.pico) * 100)}%` }}
            />
          ))}
        </div>
      </div>

      {/* top fotos */}
      <div className="rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper)] p-4">
        <h3 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Fotos mais curtidas</h3>
        {dados.topFotos.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--ink)]/40">Nenhuma foto publicada ainda.</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {dados.topFotos.map((f, i) => (
              <li key={f.id} className="flex items-center gap-3 rounded-[10px] border border-[var(--ink-faint)] bg-white px-3 py-2">
                <span className="font-display text-lg font-black text-[var(--gold)]">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt="" className="h-10 w-10 shrink-0 rounded-[8px] object-cover" loading="lazy" />
                <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink)]">{f.legenda ?? "Sem legenda"}</span>
                <span className="shrink-0 text-sm font-bold text-[var(--crimson)]">♥ {f.totalCurtidas}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
