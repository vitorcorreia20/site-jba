"use client";

import { useEffect, useState } from "react";
import PainelSolicitacoes from "./PainelSolicitacoes";
import PainelMembros from "./PainelMembros";
import PainelLiderancas from "./PainelLiderancas";
import PainelFotos from "./PainelFotos";

const abasDiretoria = [
  { id: "fotos", label: "Fotos de ações" },
  { id: "membros", label: "Membros" },
  { id: "solicitacoes", label: "Solicitações" },
  { id: "liderancas", label: "Lideranças" },
] as const;

const abasComissao = [{ id: "solicitacoes", label: "Solicitações de admissão" }] as const;

type Papel = "DIRETORIA" | "COMISSAO";
type AbaIdDiretoria = (typeof abasDiretoria)[number]["id"];
type AbaIdComissao = (typeof abasComissao)[number]["id"];

export default function AdminPanel({ papel }: { papel: Papel }) {
  const isDiretoria = papel === "DIRETORIA";
  const abas = isDiretoria ? abasDiretoria : abasComissao;
  const [abaAtiva, setAbaAtiva] = useState<string>(isDiretoria ? "fotos" : "solicitacoes");

  useEffect(() => {
    setAbaAtiva(isDiretoria ? "fotos" : "solicitacoes");
  }, [isDiretoria]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[var(--ink-faint)] pb-3" role="tablist" aria-label="Seções do painel">
        {abas.map((aba) => {
          const ativa = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              role="tab"
              aria-selected={ativa}
              aria-controls={`painel-${aba.id}`}
              onClick={() => setAbaAtiva(aba.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                ativa
                  ? "bg-[var(--crimson)] text-white shadow"
                  : "bg-[var(--paper-2)] text-[var(--ink)]/60 hover:bg-white hover:text-[var(--crimson)] border border-[var(--ink-faint)]"
              }`}
            >
              {aba.label}
            </button>
          );
        })}
      </div>

      {!isDiretoria && (
        <p className="mt-4 rounded-full border border-[var(--gold-border)] bg-[var(--gold-faint)] px-3 py-2 text-xs font-medium text-[var(--crimson)]">
          Acesso da comissão: somente solicitações de admissão. Para editar membros/fotos, solicite acesso de diretoria.
        </p>
      )}

      <div className="mt-6" role="tabpanel" id={`painel-${abaAtiva}`} aria-live="polite">
        {abaAtiva === "solicitacoes" && <PainelSolicitacoes />}
        {isDiretoria && abaAtiva === "membros" && <PainelMembros />}
        {isDiretoria && abaAtiva === "liderancas" && <PainelLiderancas />}
        {isDiretoria && abaAtiva === "fotos" && <PainelFotos />}
      </div>
    </div>
  );
}
