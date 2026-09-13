"use client";

import React, { useEffect, useState } from "react";

type Solicitacao = {
  id: string;
  nomeCompleto: string;
  email: string;
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
    setSolicitacoes(
      (atual: Solicitacao[] | null) =>
        atual?.map((s: Solicitacao) => (s.id === id ? { ...s, status } : s)) ?? null
    );
  }

  if (!solicitacoes) return <p className="text-grafite/60">Carregando...</p>;
  if (solicitacoes.length === 0)
    return <p className="text-grafite/60">Nenhuma solicitação recebida ainda.</p>;

  return (
    <div className="space-y-4">
      {solicitacoes.map((s: Solicitacao) => (
        <div key={s.id} className="rounded border border-grafite/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-vermelho">{s.nomeCompleto}</p>
              <p className="text-sm text-grafite/60">
                {s.email} · {s.telefone} · {s.cidade}
              </p>
            </div>
            <select
              value={s.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                atualizarStatus(s.id, e.target.value as Solicitacao["status"])
              }
              className="rounded border border-grafite/20 px-2 py-1 text-sm"
            >
              {Object.entries(statusLabel).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>
          {s.mensagem && (
            <p className="mt-3 text-sm text-grafite/80">{s.mensagem}</p>
          )}
        </div>
      ))}
    </div>
  );
}
