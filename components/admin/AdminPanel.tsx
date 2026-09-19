"use client";

import { useEffect, useState } from "react";
import PainelSolicitacoes from "./PainelSolicitacoes";
import PainelMembros from "./PainelMembros";
import PainelLiderancas from "./PainelLiderancas";
import PainelFotos from "./PainelFotos";
import PainelContatos from "./PainelContatos";
import PainelUsuarios from "./PainelUsuarios";

const abasDiretoria = [
  { id: "fotos", label: "Fotos de ações" },
  { id: "usuarios", label: "Usuários" },
  { id: "membros", label: "Membros" },
  { id: "solicitacoes", label: "Solicitações" },
  { id: "contatos", label: "Contatos" },
  { id: "liderancas", label: "Lideranças" },
] as const;

const abasComissao = [
  { id: "solicitacoes", label: "Solicitações de admissão" },
  { id: "contatos", label: "Contatos" },
] as const;

type Papel = "DIRETORIA" | "COMISSAO";
type AbaIdDiretoria = (typeof abasDiretoria)[number]["id"];
type AbaIdComissao = (typeof abasComissao)[number]["id"];

export default function AdminPanel({ papel, emailAtual }: { papel: Papel; emailAtual?: string }) {
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
          Acesso de gestor: solicitações e contatos (listar, marcar lido e marcar contato realizado). Para editar membros/fotos/usuários/lideranças, solicite Administração (Diretoria).
        </p>
      )}

      <div className="mt-6" role="tabpanel" id={`painel-${abaAtiva}`} aria-live="polite">
        {abaAtiva === "solicitacoes" && <PainelSolicitacoes papel={papel} />}
        {(isDiretoria || papel === "COMISSAO") && abaAtiva === "contatos" && <PainelContatos papel={papel} />}
        {isDiretoria && abaAtiva === "membros" && <PainelMembros />}
        {isDiretoria && abaAtiva === "liderancas" && <PainelLiderancas />}
        {isDiretoria && abaAtiva === "fotos" && <PainelFotos />}
        {isDiretoria && abaAtiva === "usuarios" && <PainelUsuarios emailAtual={emailAtual} />}
      </div>
    </div>
  );
}
