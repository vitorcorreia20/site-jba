"use client";

import Image from "next/image";

type Premio = {
  id: string;
  imagemUrl: string;
  legenda: string | null;
};

type Props = {
  idx: number;
  idDemolay: string;
  nome: string;
  fotoUrl: string | null;
  cargoAtual: string | null;
  premios: Premio[];
  onOpen: () => void;
};

export default function AtivoCard({ idx, idDemolay, nome, fotoUrl, cargoAtual, premios, onOpen }: Props) {
  return (
    <li
      className="group flex items-center gap-3 border-b border-[var(--ink-faint)] last:border-0 sm:gap-4"
      style={{ borderLeft: idx % 2 === 0 ? "3px solid transparent" : "3px solid rgba(201,162,39,0.18)" }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver detalhes de ${nome}, ID ${idDemolay}`}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[var(--paper-2)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-inset sm:gap-4 sm:px-5"
      >
        {/* índice – desktop only */}
        <span className="hidden shrink-0 font-display text-xs font-bold tracking-wide text-[var(--ink)]/15 sm:block">
          {String(idx + 1).padStart(2, "0")}
        </span>

        {/* badge ID */}
        <span className="shrink-0 rounded-full bg-[var(--crimson)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow">
          #{idDemolay}
        </span>

        {/* texto */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-semibold leading-tight text-[var(--ink)] group-hover:text-[var(--crimson)]">
            {nome}
          </p>
          <p className="truncate text-xs font-medium text-[var(--ink)]/50">
            {cargoAtual ? (
              <span className="uppercase tracking-wide text-[var(--gold)]">{cargoAtual}</span>
            ) : (
              "—"
            )}
          </p>
        </div>

        {/* foto – maior no mobile, sempre visível */}
        {fotoUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-[var(--gold)]/15 bg-[var(--paper-2)] sm:h-10 sm:w-10 sm:rounded-full">
            <Image
              src={fotoUrl}
              alt={nome}
              fill
              sizes="56px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper-2)] font-display text-sm font-bold text-[var(--ink)]/30 sm:h-10 sm:w-10 sm:rounded-full">
            {nome.charAt(0).toUpperCase()}
          </span>
        )}

        {/* prêmios – visível também no mobile (até 2) */}
        {premios.length > 0 && (
          <div className="hidden items-center gap-1.5 sm:flex">
            {premios.slice(0, 3).map((pr) => (
              <div
                key={pr.id}
                className="relative h-7 w-7 overflow-hidden rounded-[8px] border border-[var(--ink-faint)] bg-[var(--paper-2)]"
                title={pr.legenda ?? ""}
              >
                <Image src={pr.imagemUrl} alt={pr.legenda ?? "Prêmio"} fill sizes="28px" className="object-cover" />
              </div>
            ))}
            {premios.length > 3 && (
              <span className="rounded-full bg-[var(--paper-2)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--ink)]/40">
                +{premios.length - 3}
              </span>
            )}
          </div>
        )}
        {/* mobile: indicador compacto */}
        {premios.length > 0 && (
          <span className="flex items-center gap-1 sm:hidden">
            <span className="relative h-7 w-7 overflow-hidden rounded-[8px] border border-[var(--ink-faint)] bg-[var(--paper-2)]">
              <Image src={premios[0].imagemUrl} alt={premios[0].legenda ?? "Prêmio"} fill sizes="28px" className="object-cover" />
            </span>
            {premios.length > 1 && (
              <span className="text-[11px] font-semibold text-[var(--ink)]/40">+{premios.length - 1}</span>
            )}
          </span>
        )}

        {/* chevron expandir */}
        <span
          aria-hidden
          className="ml-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--ink-faint)] bg-white text-[11px] text-[var(--ink)]/40 transition-colors group-hover:border-[var(--gold)]/30 group-hover:text-[var(--crimson)] sm:flex"
        >
          ↗
        </span>
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--ink-faint)] bg-white text-[11px] text-[var(--ink)]/40 sm:hidden"
        >
          ›
        </span>
      </button>
    </li>
  );
}
