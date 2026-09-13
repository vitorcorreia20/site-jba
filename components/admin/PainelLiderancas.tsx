"use client";

import { useEffect, useState, FormEvent } from "react";

type Mestre = {
  id: string;
  nome: string;
  fotoUrl: string | null;
  periodo: string;
  ordem: number;
};

export default function PainelLiderancas() {
  const [mestres, setMestres] = useState<Mestre[] | null>(null);

  function recarregar() {
    fetch("/api/admin/liderancas")
      .then((r) => r.json())
      .then(setMestres);
  }

  useEffect(recarregar, []);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries());

    await fetch("/api/admin/liderancas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    evento.currentTarget.reset();
    recarregar();
  }

  async function remover(id: string) {
    await fetch(`/api/admin/liderancas/${id}`, { method: "DELETE" });
    recarregar();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-xl text-vermelho">
          Novo Mestre Conselheiro
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-grafite">Nome</label>
            <input
              name="nome"
              required
              className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grafite">
              Período (ex: 2023 ou 2023/2024)
            </label>
            <input
              name="periodo"
              required
              className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grafite">
              URL da foto
            </label>
            <input
              name="fotoUrl"
              className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grafite">
              Ordem de exibição
            </label>
            <input
              name="ordem"
              type="number"
              className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-vermelho px-4 py-2 text-sm font-medium text-papel hover:bg-vermelho-claro"
          >
            Adicionar
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl text-vermelho">
          Mestres cadastrados
        </h2>
        <ul className="mt-4 space-y-2">
          {mestres?.map((m: Mestre) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded border border-grafite/10 px-4 py-2 text-sm"
            >
              <span>
                <strong>{m.nome}</strong> — {m.periodo}
              </span>
              <button
                onClick={() => remover(m.id)}
                className="text-red-700 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
          {mestres?.length === 0 && (
            <p className="text-grafite/60">Nenhum Mestre cadastrado ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
