"use client";

import { useEffect, useState, FormEvent } from "react";

type Foto = {
  id: string;
  url: string;
  legenda: string | null;
  ordem: number;
};

export default function PainelFotos() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);

  function recarregar() {
    fetch("/api/admin/fotos")
      .then((r) => r.json())
      .then(setFotos);
  }

  useEffect(recarregar, []);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries());

    await fetch("/api/admin/fotos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    evento.currentTarget.reset();
    recarregar();
  }

  async function remover(id: string) {
    await fetch(`/api/admin/fotos/${id}`, { method: "DELETE" });
    recarregar();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-xl text-vermelho">Nova foto de ação</h2>
        <p className="mt-1 text-sm text-grafite/60">
          Envie a foto para o Vercel Blob (ou outro serviço) e cole a URL
          pública aqui.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-grafite">
              URL da imagem
            </label>
            <input
              name="url"
              required
              className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grafite">
              Legenda
            </label>
            <input
              name="legenda"
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
            Adicionar foto
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl text-vermelho">Fotos cadastradas</h2>
        <ul className="mt-4 space-y-2">
          {fotos?.map((f: Foto) => (
            <li
              key={f.id}
              className="flex items-center justify-between rounded border border-grafite/10 px-4 py-2 text-sm"
            >
              <span className="truncate">{f.legenda || f.url}</span>
              <button
                onClick={() => remover(f.id)}
                className="text-red-700 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
          {fotos?.length === 0 && (
            <p className="text-grafite/60">Nenhuma foto cadastrada ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
