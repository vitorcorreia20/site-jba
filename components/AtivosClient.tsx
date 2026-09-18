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
            className="relative flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-strong"
          >
            {/* header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--ink-faint)] bg-[var(--paper)] px-5 py-3">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--crimson)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                Detalhes do membro
              </span>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ink-faint)] bg-white text-[var(--ink)]/60 transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--crimson)]"
              >
                ✕
              </button>
            </div>

            {/* corpo scrollável: layout lado a lado */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 p-5 sm:flex-row sm:gap-6 sm:p-6">
                {/* coluna esquerda: foto menor + prêmios abaixo */}
                <div className="shrink-0 sm:w-[210px]">
                  <div className="relative mx-auto w-full max-w-[260px] overflow-hidden rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper-2)] p-1.5 sm:mx-0">
                    {selecionado.fotoUrl ? (
                      <div className="relative aspect-[3/4] max-h-[260px] w-full overflow-hidden rounded-[10px] bg-white">
                        <Image
                          src={selecionado.fotoUrl}
                          alt={selecionado.nome}
                          fill
                          sizes="210px"
                          className="object-contain"
                          priority={false}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[3/4] max-h-[260px] flex-col items-center justify-center gap-3 rounded-[10px] bg-white p-6">
                        <span className="numeral-watermark text-5xl font-black text-[var(--crimson)]/10">512</span>
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--crimson)]/10 bg-[var(--paper-2)] font-display text-2xl font-bold text-[var(--crimson)]/40">
                          {selecionado.nome.charAt(0).toUpperCase()}
                        </span>
                        <p className="text-xs text-[var(--ink)]/40">Sem foto cadastrada</p>
                      </div>
                    )}
                  </div>

                  {/* Prêmios abaixo da foto */}
                  <div className="mt-4">
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink)]/40">
                      <span className="h-px w-4 bg-[var(--gold)]/40" />
                      Prêmios e honrarias {selecionado.premios.length > 0 && `(${selecionado.premios.length})`}
                    </p>
                    {selecionado.premios.length > 0 ? (
                      <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-2 sm:gap-2">
                        {selecionado.premios.map((pr) => (
                          <figure
                            key={pr.id}
                            className="overflow-hidden rounded-[10px] border border-[var(--ink-faint)] bg-[var(--paper-2)]"
                          >
                            <div className="relative aspect-square w-full">
                              <Image
                                src={pr.imagemUrl}
                                alt={pr.legenda ?? `Prêmio de ${selecionado.nome}`}
                                fill
                                sizes="100px"
                                className="object-cover"
                              />
                            </div>
                            {pr.legenda && (
                              <figcaption
                                className="truncate px-1.5 py-1 text-[11px] leading-tight text-[var(--ink-soft)]"
                                title={pr.legenda}
                              >
                                {pr.legenda}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 rounded-[10px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)]/40 px-3 py-2 text-center text-xs text-[var(--ink)]/30">
                        Nenhum prêmio
                      </p>
                    )}
                  </div>
                </div>

                {/* coluna direita: ID, nome, cargo, histórico */}
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-[var(--crimson)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow">
                    #{selecionado.idDemolay}
                  </span>
                  <h3 className="mt-3 font-display text-[20px] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
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

                  <div className="mt-6 flex justify-end sm:justify-start">
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
          </div>
        </div>
      )}
    </>
  );
}
