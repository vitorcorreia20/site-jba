"use client";

import { useCallback, useEffect, useState } from "react";

type ItemAuditoria = {
  id: string;
  atorNome: string | null;
  atorEmail: string | null;
  atorPapel: string | null;
  acao: string;
  entidade: string;
  entidadeId: string | null;
  detalhe: string | null;
  ip: string | null;
  criadoEm: string;
};

const ACOES = ["", "LOGIN", "LOGIN_FALHA", "CRIAR", "EDITAR", "REMOVER", "ALTERAR_STATUS", "UPLOAD"];
const ENTIDADES = ["", "sessao", "foto", "membro", "lideranca", "solicitacao", "contato", "usuario", "arquivo"];

function rotuloAcao(acao: string) {
  const mapa: Record<string, string> = {
    LOGIN: "Login",
    LOGIN_FALHA: "Falha de login",
    CRIAR: "Criação",
    EDITAR: "Edição",
    REMOVER: "Remoção",
    ALTERAR_STATUS: "Status",
    UPLOAD: "Upload",
  };
  return mapa[acao] ?? acao;
}

function classeAcao(acao: string) {
  if (acao === "LOGIN_FALHA" || acao === "REMOVER")
    return "bg-red-50 text-red-700 border-red-200";
  if (acao === "LOGIN") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (acao === "CRIAR") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-[var(--gold-faint)] text-[var(--crimson)] border-[var(--gold-border)]";
}

export default function PainelAuditoria() {
  const [itens, setItens] = useState<ItemAuditoria[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [acao, setAcao] = useState("");
  const [entidade, setEntidade] = useState("");
  const [busca, setBusca] = useState("");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  const carregar = useCallback(async (pagina = 1, acumulado: ItemAuditoria[] = []) => {
    setCarregando(true);
    setErro(null);
    try {
      const params = new URLSearchParams({ page: String(pagina), take: "30" });
      if (acao) params.set("acao", acao);
      if (entidade) params.set("entidade", entidade);
      if (busca.trim()) params.set("busca", busca.trim());
      if (de) params.set("de", de);
      if (ate) params.set("ate", ate);
      const resp = await fetch(`/api/admin/auditoria?${params}`);
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.erro || "Erro ao carregar auditoria");
      setItens(pagina === 1 ? json.itens : [...acumulado, ...json.itens]);
      setTotal(json.total);
      setHasMore(Boolean(json.hasMore));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar auditoria");
    } finally {
      setCarregando(false);
    }
  }, [acao, entidade, busca, de, ate]);

  useEffect(() => {
    carregar(1);
  }, [carregar]);

  function csvUrl() {
    const params = new URLSearchParams({ formato: "csv", take: "5000" });
    if (acao) params.set("acao", acao);
    if (entidade) params.set("entidade", entidade);
    if (busca.trim()) params.set("busca", busca.trim());
    if (de) params.set("de", de);
    if (ate) params.set("ate", ate);
    return `/api/admin/auditoria?${params}`;
  }

  return (
    <div className="space-y-4">
      {/* filtros */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          carregar(1);
        }}
        className="grid gap-2 rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper)] p-3 sm:grid-cols-2 lg:grid-cols-6"
      >
        <select
          value={acao}
          onChange={(e) => setAcao(e.target.value)}
          aria-label="Filtrar por ação"
          className="rounded-[10px] border border-[var(--ink-faint)] bg-white px-2.5 py-2 text-sm"
        >
          {ACOES.map((a) => (
            <option key={a} value={a}>{a ? rotuloAcao(a) : "Todas ações"}</option>
          ))}
        </select>
        <select
          value={entidade}
          onChange={(e) => setEntidade(e.target.value)}
          aria-label="Filtrar por área"
          className="rounded-[10px] border border-[var(--ink-faint)] bg-white px-2.5 py-2 text-sm"
        >
          {ENTIDADES.map((e) => (
            <option key={e} value={e}>{e || "Todas áreas"}</option>
          ))}
        </select>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar ator ou detalhe…"
          aria-label="Buscar por ator ou detalhe"
          className="rounded-[10px] border border-[var(--ink-faint)] bg-white px-2.5 py-2 text-sm placeholder:text-[var(--ink)]/30"
        />
        <input
          type="date"
          value={de}
          onChange={(e) => setDe(e.target.value)}
          aria-label="De"
          className="rounded-[10px] border border-[var(--ink-faint)] bg-white px-2.5 py-2 text-sm"
        />
        <input
          type="date"
          value={ate}
          onChange={(e) => setAte(e.target.value)}
          aria-label="Até"
          className="rounded-[10px] border border-[var(--ink-faint)] bg-white px-2.5 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-full bg-[var(--crimson)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--crimson-deep)]"
          >
            Filtrar
          </button>
          <a
            href={csvUrl()}
            download
            className="flex-1 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-2 text-center text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)]"
          >
            CSV
          </a>
        </div>
      </form>

      <p className="text-xs text-[var(--ink)]/50">{total} registro{total === 1 ? "" : "s"} encontrado{total === 1 ? "" : "s"}</p>
      {erro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      <ul className="space-y-2">
        {itens.map((a) => (
          <li key={a.id} className="rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${classeAcao(a.acao)}`}>
                {rotuloAcao(a.acao)}
              </span>
              <span className="rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--ink)]/60">
                {a.entidade}
              </span>
              <span className="ml-auto text-[11px] text-[var(--ink)]/40">
                {new Date(a.criadoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {a.detalhe && <p className="mt-1.5 text-sm leading-snug text-[var(--ink)]">{a.detalhe}</p>}
            <p className="mt-1 truncate text-[11px] text-[var(--ink)]/40">
              {a.atorNome ?? "—"}{a.atorEmail ? ` · ${a.atorEmail}` : ""}{a.atorPapel ? ` [${a.atorPapel}]` : ""}{a.ip ? ` · ${a.ip}` : ""}
            </p>
          </li>
        ))}
        {itens.length === 0 && !carregando && (
          <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
            Nenhum registro para estes filtros.
          </li>
        )}
      </ul>

      {hasMore && (
        <button
          type="button"
          disabled={carregando}
          onClick={() => {
            const proxima = Math.floor(itens.length / 30) + 1;
            carregar(proxima, itens);
          }}
          className="w-full rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--crimson)] hover:bg-[var(--paper-2)] disabled:opacity-50"
        >
          {carregando ? "Carregando…" : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
