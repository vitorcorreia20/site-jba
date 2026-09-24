"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";

type Foto = {
  id: string;
  url: string;
  legenda: string | null;
};

export default function HeroCarrossel({ fotos }: { fotos: Foto[] }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const count = fotos.length;

  const goNext = useCallback(() => {
    setIdx((i) => (i + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setIdx((i) => (i - 1 + count) % count);
  }, [count]);

  // reset idx when fotos change (e.g., fewer items)
  useEffect(() => {
    if (idx >= count) setIdx(0);
  }, [count, idx]);

  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(goNext, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, goNext]);

  // pause on hover
  const pause = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const resume = useCallback(() => {
    if (count <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 7000);
  }, [count, goNext]);

  if (count === 0) {
    return (
      <div className="relative overflow-hidden rounded-[18px] border border-[var(--gold)]/25 bg-[var(--crimson-deep)] p-[5px] shadow-strong">
        <div className="relative flex aspect-[4/3.4] flex-col items-center justify-center gap-3 overflow-hidden rounded-[13px] bg-[var(--paper-2)] p-8 text-center">
          <span className="numeral-watermark text-6xl font-black text-[var(--crimson)]/10">512</span>
          <p className="font-display text-lg font-semibold text-[var(--crimson)]">Nossas ações em imagens</p>
          <p className="max-w-[28ch] text-sm leading-relaxed text-[var(--ink-soft)]">
            As fotos das atividades aparecerão aqui assim que forem cadastradas no painel administrativo.
          </p>
        </div>
      </div>
    );
  }

  const foto = fotos[idx];

  return (
    <div
      className="group relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="relative overflow-hidden rounded-[18px] border border-[var(--gold)]/25 bg-[var(--crimson-deep)] p-[5px] shadow-strong">
        <div className="relative aspect-[4/3.4] overflow-hidden rounded-[13px] bg-[var(--paper-2)]">
          <Image
            key={foto.id}
            src={foto.url}
            alt={foto.legenda ?? "Ação do capítulo em destaque"}
            fill
            priority={idx === 0}
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover transition-opacity duration-700"
          />
          {foto.legenda && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-10">
              <p className="text-sm font-medium leading-snug text-white drop-shadow">{foto.legenda}</p>
            </div>
          )}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition-all duration-200 hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition-all duration-200 hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>

          {/* dots indicadores */}
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {fotos.slice(0, 7).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            Foto {idx + 1} de {Math.min(count, 7)}
          </span>
        </>
      )}

      {/* losango e selo mantidos fora do carrossel no page.tsx */}
    </div>
  );
}
