"use client";

import { useEffect, useState } from "react";

type Contato = {
  id: string;
  nome: string;
  telefone: string;
  descricao: string | null;
  lido: boolean;
  realizado: boolean;
  criadoEm: string;
};

export default function PainelContatos({ papel }: { papel?: "DIRETORIA" | "COMISSAO" } = {}) {
  const [contatos, setContatos] = useState<Contato[] | null>(null);

  function recarregar() {
    fetch("/api/admin/contatos")
      .then((r) => r.json())
      .then((data) => setContatos(Array.isArray(data) ? data : []));
  }

  useEffect(recarregar, []);

  async function toggleLido(c: Contato) {
    await fetch(`/api/admin/contatos/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lido: !c.lido }),
    });
    setContatos((atual) => atual?.map((x) => (x.id === c.id ? { ...x, lido: !c.lido } : x)) ?? null);
  }

  async function toggleRealizado(c: Contato) {
    await fetch(`/api/admin/contatos/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ realizado: !c.realizado }),
    });
    setContatos((atual) => atual?.map((x) => (x.id === c.id ? { ...x, realizado: !c.realizado } : x)) ?? null);
  }

  async function remover(id: string) {
    if (papel === "COMISSAO") return; // GESTOR não pode remover
    if (!window.confirm("Remover esta mensagem?")) return;
    await fetch(`/api/admin/contatos/${id}`, { method: "DELETE" });
    recarregar();
  }

  if (!contatos)
    return (
      <div className="space-y-3">
        <div className="h-20 animate-pulse rounded-[12px] bg-[var(--paper-2)]" />
        <div className="h-20 animate-pulse rounded-[12px] bg-[var(--paper-2)]" />
      </div>
    );
  if (contatos.length === 0)
    return (
      <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-8 text-center">
        <p className="numeral-watermark mx-auto text-4xl font-black text-[var(--ink)]/10">512</p>
        <p className="mt-2 text-sm font-medium text-[var(--ink)]/60">Nenhum contato recebido.</p>
        <p className="text-xs text-[var(--ink)]/40">Mensagens de /contato aparecerão aqui.</p>
      </div>
    );

  return (
    <div className="space-y-3">
      {contatos.map((c) => {
        const telDigits = c.telefone.replace(/\D/g, "");
        const waUrl = `https://wa.me/55${telDigits}`;
        return (
          <div key={c.id} className="rounded-[16px] border border-[var(--ink-faint)] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold text-[var(--crimson)]">{c.nome}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--ink)]/60">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {c.telefone}
                  </a>
                  <span>· {new Date(c.criadoEm).toLocaleDateString("pt-BR")}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${c.lido ? "bg-[var(--paper-2)] text-[var(--ink)]/50 border-[var(--ink-faint)]" : "bg-[var(--gold-faint)] text-[var(--crimson)] border-[var(--gold-border)]"}`}>{c.lido ? "Lido" : "Novo"}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${c.realizado ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-[var(--ink)]/40 border-[var(--ink-faint)]"}`}>{c.realizado ? "Contato realizado" : "Pendente contato"}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleLido(c)} className="rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)]">{c.lido ? "Marcar novo" : "Marcar lido"}</button>
                <button onClick={() => toggleRealizado(c)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${c.realizado ? "border-[var(--gold-border)] bg-[var(--gold-faint)] text-[var(--crimson)] hover:bg-white" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>{c.realizado ? "Desmarcar realizado" : "Marcar contato realizado"}</button>
                {papel !== "COMISSAO" && (
                  <button onClick={() => remover(c.id)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">Remover</button>
                )}
              </div>
            </div>
            {c.descricao && <p className="mt-3 rounded-xl bg-[var(--paper)] p-3 text-sm leading-relaxed text-[var(--ink-soft)]">{c.descricao}</p>}
            <div className="mt-3">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Abrir WhatsApp</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
