"use client";

import { useCallback, useEffect, useState } from "react";
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
  { id: "fotos", label: "Fotos de ações" },
] as const;

type Papel = "DIRETORIA" | "COMISSAO";
type Aba = { id: string; label: string };

function itemAbaClass(ativa: boolean) {
  return ativa
    ? "border-[var(--crimson)] bg-[var(--crimson)] text-white shadow"
    : "border-[var(--ink-faint)] bg-[var(--paper-2)] text-[var(--ink)]/70 hover:border-[var(--crimson)]/40 hover:bg-white hover:text-[var(--crimson)]";
}

function ListaAbas({
  abas,
  abaAtiva,
  onSelect,
}: {
  abas: readonly Aba[];
  abaAtiva: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {abas.map((aba) => {
        const ativa = abaAtiva === aba.id;
        return (
          <li key={aba.id}>
            <button
              type="button"
              role="tab"
              aria-selected={ativa}
              aria-controls={`painel-${aba.id}`}
              onClick={() => onSelect(aba.id)}
              className={`w-full rounded-[12px] border px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--crimson)] ${itemAbaClass(ativa)}`}
            >
              {aba.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminPanel({ papel, emailAtual }: { papel: Papel; emailAtual?: string }) {
  const isDiretoria = papel === "DIRETORIA";
  const abas = isDiretoria ? abasDiretoria : abasComissao;
  const [abaAtiva, setAbaAtiva] = useState<string>(isDiretoria ? "fotos" : "solicitacoes");
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setAbaAtiva(isDiretoria ? "fotos" : "solicitacoes");
  }, [isDiretoria]);

  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharMenu();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuAberto, fecharMenu]);

  const selecionarAba = (id: string) => {
    setAbaAtiva(id);
    fecharMenu();
  };

  const labelAbaAtiva = abas.find((a) => a.id === abaAtiva)?.label ?? "Seções";

  return (
    <div className="lg:grid lg:grid-cols-[224px_minmax(0,1fr)] lg:items-start lg:gap-7">
      {/* Barra lateral — desktop */}
      <aside
        className="hidden lg:sticky lg:top-24 lg:block"
        role="tablist"
        aria-label="Seções do painel"
        aria-orientation="vertical"
      >
        <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]/40">
          Seções
        </p>
        <ListaAbas abas={abas} abaAtiva={abaAtiva} onSelect={selecionarAba} />
      </aside>

      {/* Hambúrguer + rótulo — mobile/tablet */}
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-haspopup="dialog"
          aria-expanded={menuAberto}
          aria-label="Abrir menu de seções"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[var(--ink-faint)] bg-white text-[var(--ink)]/70 transition-colors hover:border-[var(--crimson)]/40 hover:text-[var(--crimson)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--crimson)]">
          {labelAbaAtiva}
        </span>
      </div>

      {/* Gaveta de seções — mobile/tablet */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm lg:hidden"
          onClick={fecharMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Seções do painel"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-[280px] max-w-[85vw] flex-col border-r border-[var(--ink-faint)] bg-white shadow-strong"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--ink-faint)] bg-[var(--paper)] px-4 py-3">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--crimson)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                Seções do painel
              </span>
              <button
                type="button"
                onClick={fecharMenu}
                aria-label="Fechar menu"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ink-faint)] bg-white text-[var(--ink)]/60 transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--crimson)]"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4" role="tablist" aria-label="Seções do painel">
              <ListaAbas abas={abas} abaAtiva={abaAtiva} onSelect={selecionarAba} />
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="rounded-[18px] border border-[var(--ink-faint)] bg-white p-4 shadow-soft sm:p-6 lg:p-8">
        {!isDiretoria && (
          <p className="mb-4 rounded-[12px] border border-[var(--gold-border)] bg-[var(--gold-faint)] px-3 py-2 text-xs font-medium leading-relaxed text-[var(--crimson)] sm:rounded-full">
            Acesso de gestor: solicitações, contatos e fotos de ações (adicionar e editar). Exclusão
            apenas pela Administração. Para editar membros/usuários/lideranças, solicite Administração
            (Diretoria).
          </p>
        )}

        <div role="tabpanel" id={`painel-${abaAtiva}`} aria-live="polite">
          {abaAtiva === "solicitacoes" && <PainelSolicitacoes papel={papel} />}
          {(isDiretoria || papel === "COMISSAO") && abaAtiva === "contatos" && <PainelContatos papel={papel} />}
          {(isDiretoria || papel === "COMISSAO") && abaAtiva === "fotos" && <PainelFotos papel={papel} />}
          {isDiretoria && abaAtiva === "membros" && <PainelMembros />}
          {isDiretoria && abaAtiva === "liderancas" && <PainelLiderancas />}
          {isDiretoria && abaAtiva === "usuarios" && <PainelUsuarios emailAtual={emailAtual} />}
        </div>
      </div>
    </div>
  );
}
