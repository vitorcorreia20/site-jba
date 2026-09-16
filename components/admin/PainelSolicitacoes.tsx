"use client";

import React, { useEffect, useState } from "react";

type Solicitacao = {
  id: string;
  nomeCompleto: string;
  email: string | null;
  telefone: string;
  cidade: string;
  mensagem: string | null;
  status: "PENDENTE" | "EM_ANALISE" | "APROVADO" | "RECUSADO";
  criadoEm: string;
};

const statusLabel: Record<Solicitacao["status"], string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
};

const statusStyle: Record<Solicitacao["status"], string> = {
  PENDENTE: "bg-[var(--gold-faint)] text-[var(--crimson)] border-[var(--gold-border)]",
  EM_ANALISE: "bg-blue-50 text-blue-700 border-blue-200",
  APROVADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RECUSADO: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

function formatTelefone(tel: string): string {
  const d = tel.replace(/\D/g, "");
  return d;
}

export default function PainelSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/solicitacoes")
      .then((r) => r.json())
      .then(setSolicitacoes);
  }, []);

  async function atualizarStatus(id: string, status: Solicitacao["status"]) {
    await fetch(`/api/admin/solicitacoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSolicitacoes((atual) => atual?.map((s) => (s.id === id ? { ...s, status } : s)) ?? null);
  }

  if (!solicitacoes)
    return (
      <div className="space-y-3">
        <div className="h-20 animate-pulse rounded-[12px] bg-[var(--paper-2)]" />
        <div className="h-20 animate-pulse rounded-[12px] bg-[var(--paper-2)]" />
      </div>
    );
  if (solicitacoes.length === 0)
    return (
      <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-8 text-center">
        <p className="numeral-watermark mx-auto text-4xl font-black text-[var(--ink)]/10">512</p>
        <p className="mt-2 text-sm font-medium text-[var(--ink)]/60">Nenhuma solicitação recebida ainda.</p>
        <p className="text-xs text-[var(--ink)]/40">Novas solicitações do formulário aparecerão aqui.</p>
      </div>
    );

  return (
    <div className="space-y-3">
      {solicitacoes.map((s) => {
        const telDigits = formatTelefone(s.telefone);
        const waUrl = `https://wa.me/55${telDigits}`;
        return (
          <div key={s.id} className="rounded-[16px] border border-[var(--ink-faint)] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold text-[var(--crimson)]">{s.nomeCompleto}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--ink)]/60">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {s.telefone}
                  </a>
                  <span>· {s.cidade}</span>
                  {s.email && <span>· {s.email}</span>}
                  <span>· {new Date(s.criadoEm).toLocaleDateString("pt-BR")}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyle[s.status]}`}>
                  {statusLabel[s.status]}
                </span>
                <select
                  value={s.status}
                  onChange={(e) => atualizarStatus(s.id, e.target.value as Solicitacao["status"])}
                  aria-label={`Status de ${s.nomeCompleto}`}
                  className="rounded-[10px] border border-[var(--ink-faint)] bg-white px-2 py-1 text-xs font-medium focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                >
                  {Object.entries(statusLabel).map(([valor, rotulo]) => (
                    <option key={valor} value={valor}>
                      {rotulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {s.mensagem && <p className="mt-3 rounded-xl bg-[var(--paper)] p-3 text-sm leading-relaxed text-[var(--ink-soft)]">{s.mensagem}</p>}
            <div className="mt-3 flex gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
