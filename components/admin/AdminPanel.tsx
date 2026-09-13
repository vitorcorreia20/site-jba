"use client";

import { useState } from "react";
import PainelSolicitacoes from "./PainelSolicitacoes";
import PainelMembros from "./PainelMembros";
import PainelLiderancas from "./PainelLiderancas";
import PainelFotos from "./PainelFotos";

const abas = [
  { id: "solicitacoes", label: "Solicitações de admissão" },
  { id: "membros", label: "Membros (ativos e diretoria)" },
  { id: "liderancas", label: "Quadro de lideranças" },
  { id: "fotos", label: "Fotos de ações" },
] as const;

type AbaId = (typeof abas)[number]["id"];

export default function AdminPanel() {
  const [abaAtiva, setAbaAtiva] = useState<AbaId>("solicitacoes");

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-grafite/10">
        {abas.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`rounded-t px-4 py-2 text-sm font-medium transition-colors ${
              abaAtiva === aba.id
                ? "border-b-2 border-dourado text-azul"
                : "text-grafite/60 hover:text-azul"
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {abaAtiva === "solicitacoes" && <PainelSolicitacoes />}
        {abaAtiva === "membros" && <PainelMembros />}
        {abaAtiva === "liderancas" && <PainelLiderancas />}
        {abaAtiva === "fotos" && <PainelFotos />}
      </div>
    </div>
  );
}
