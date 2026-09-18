"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import AtivoCard from "./AtivoCard";

type Premio = {
  id: string;
  imagemUrl: string;
  legenda: string | null;
  ordem: number;
};

type Membro = {
  id: string;
  idDemolay: string;
  nome: string;
  fotoUrl: string | null;
  cargoAtual: string | null;
  historicoCargos: string | null;
  premios: Premio[];
};

export default function AtivosClient({ membros }: { membros: Membro[] }) {
  const [selecionado, setSelecionado] = useState<Membro | null>(null);

  const fechar = useCallback(() => setSelecionado(null), []);

  // ESC + lock scroll + foco
  useEffect(() => {
    if (!selecionado) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selecionado, fechar]);

  if (membros.length === 0) return null;

  const linhasHistorico = selecionado?.historicoCargos
    ?.split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <>
      <ul className="overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-soft">
        {membros.map((m, idx) => (
          <AtivoCard
            key={m.id}
            idx={idx}
            idDemolay={m.idDemolay}
            nome={m.nome}
            fotoUrl={m.fotoUrl}
            cargoAtual={m.cargoAtual}
            premios={m.premios}
            onOpen={() => setSelecionado(m)}
          />
        ))}
      </ul>

      {selecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          onClick={fechar}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes de ${selecionado.nome}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-strong"
          >
            {/* topo imagem grande */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--paper-2)] sm:aspect-[4/3.1]">
              {selecionado.fotoUrl ? (
                <Image
                  src={selecionado.fotoUrl}
                  alt={selecionado.nome}
                  fill
                  sizes="(max-width: 640px) 92vw, 512px"
                  className="object-cover"
                  priority={false}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-[var(--paper-2)] p-8">
                  <span className="numeral-watermark text-6xl font-black text-[var(--crimson)]/10">512</span>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--crimson)]/10 bg-white font-display text-3xl font-bold text-[var(--crimson)]/40">
                    {selecionado.nome.charAt(0).toUpperCase()}
                  </span>
                  <p className="text-sm text-[var(--ink)]/40">Sem foto cadastrada</p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />
              <span className="absolute left-3 top-3 rounded-full bg-[var(--crimson)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow">
                #{selecionado.idDemolay}
              </span>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/50"
              >
                ✕
              </button>
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-3 hidden h-5 w-5 rotate-45 border border-white/20 bg-white/10 backdrop-blur sm:block"
              />
            </div>

            {/* conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-[var(--crimson)]">
                {selecionado.nome}
              </h3>
              {selecionado.cargoAtual ? (
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gold)]">
                  {selecionado.cargoAtual}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[var(--ink)]/40">Sem cargo atual informado</p>
              )}
              <p className="mt-1 text-[11px] font-medium tracking-wide text-[var(--ink)]/40">
                ID DeMolay {selecionado.idDemolay}
              </p>

              <div className="my-4 h-px bg-[var(--ink-faint)]" />

              {linhasHistorico && linhasHistorico.length > 0 ? (
                <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper)]/60 p-3">
                  <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink)]/40">
                    <span className="h-px w-4 bg-[var(--gold)]/40" />
                    Histórico de cargos
                  </p>
                  <ul className="mt-2 space-y-1 text-[13px] leading-snug text-[var(--ink-soft)]">
                    {linhasHistorico.map((linha, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/60" />
                        <span>{linha}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-[var(--ink-faint)] bg-[var(--paper)]/40 px-3 py-2 text-xs text-[var(--ink)]/40">
                  Histórico de cargos não informado.
                </p>
              )}

              {selecionado.premios.length > 0 ? (
                <div className="mt-4">
                  <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink)]/40">
                    <span className="h-px w-4 bg-[var(--gold)]/40" />
                    Prêmios e honrarias ({selecionado.premios.length})
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selecionado.premios.map((pr) => (
                      <figure
                        key={pr.id}
                        className="overflow-hidden rounded-[10px] border border-[var(--ink-faint)] bg-[var(--paper-2)]"
                      >
                        <div className="relative aspect-square w-full">
                          <Image src={pr.imagemUrl} alt={pr.legenda ?? `Prêmio de ${selecionado.nome}`} fill sizes="120px" className="object-cover" />
                        </div>
                        {pr.legenda && (
                          <figcaption className="truncate px-1.5 py-1 text-[11px] leading-tight text-[var(--ink-soft)]" title={pr.legenda}>
                            {pr.legenda}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-[var(--ink)]/30">Nenhum prêmio cadastrado para este membro.</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={fechar}
                  className="rounded-full bg-[var(--crimson)] px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-[var(--crimson-deep)]"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
