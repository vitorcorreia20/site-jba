"use client";

import { useEffect, useState, FormEvent } from "react";

type Membro = {
  id: string;
  nome: string;
  fotoUrl: string | null;
  tipo: "ATIVO" | "DIRETORIA";
  cargoAtual: string | null;
  historicoCargos: string | null;
  premios: string | null;
  ordem: number;
};

export default function PainelMembros() {
  const [membros, setMembros] = useState<Membro[] | null>(null);

  function recarregar() {
    fetch("/api/admin/membros")
      .then((r) => r.json())
      .then(setMembros);
  }

  useEffect(recarregar, []);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries());

    await fetch("/api/admin/membros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    evento.currentTarget.reset();
    recarregar();
  }

  async function remover(id: string) {
    await fetch(`/api/admin/membros/${id}`, { method: "DELETE" });
    recarregar();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-xl text-azul">Novo membro</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <CampoTexto label="Nome" name="nome" required />
          <div>
            <label className="block text-sm font-medium text-grafite">
              Tipo de quadro
            </label>
            <select
              name="tipo"
              className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
            >
              <option value="ATIVO">Quadro de ativos</option>
              <option value="DIRETORIA">Diretoria (aparece com card)</option>
            </select>
          </div>
          <CampoTexto label="URL da foto" name="fotoUrl" />
          <CampoTexto label="Cargo atual" name="cargoAtual" />
          <CampoTextarea
            label="Histórico de cargos (um por linha)"
            name="historicoCargos"
          />
          <CampoTextarea
            label="Prêmios e honrarias (um por linha)"
            name="premios"
          />
          <CampoTexto label="Ordem de exibição" name="ordem" type="number" />

          <button
            type="submit"
            className="rounded bg-azul px-4 py-2 text-sm font-medium text-papel hover:bg-azul-claro"
          >
            Adicionar membro
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl text-azul">
          Membros cadastrados
        </h2>
        <ul className="mt-4 space-y-2">
          {membros?.map((m: Membro) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded border border-grafite/10 px-4 py-2 text-sm"
            >
              <span>
                <strong>{m.nome}</strong> — {m.tipo === "ATIVO" ? "Ativo" : "Diretoria"}
                {m.cargoAtual ? ` · ${m.cargoAtual}` : ""}
              </span>
              <button
                onClick={() => remover(m.id)}
                className="text-red-700 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
          {membros?.length === 0 && (
            <p className="text-grafite/60">Nenhum membro cadastrado ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

function CampoTexto({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-grafite">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
      />
    </div>
  );
}

function CampoTextarea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-grafite">{label}</label>
      <textarea
        name={name}
        rows={3}
        className="mt-1 w-full rounded border border-grafite/20 px-3 py-2"
      />
    </div>
  );
}
