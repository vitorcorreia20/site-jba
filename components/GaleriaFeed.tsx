"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FotoGaleria } from "@/lib/galeria";

const TAKE = 21;

function formatarData(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function Coracao({ preenchido, className = "h-5 w-5" }: { preenchido: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={preenchido ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function GaleriaFeed({
  iniciais,
  total,
  inicialHasMore,
}: {
  iniciais: FotoGaleria[];
  total: number;
  inicialHasMore: boolean;
}) {
  const [fotos, setFotos] = useState<FotoGaleria[]>(iniciais);
  const [pagina, setPagina] = useState(1);
  const [hasMore, setHasMore] = useState(inicialHasMore);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [curtindo, setCurtindo] = useState<Set<string>>(new Set());
  const [bigHeartId, setBigHeartId] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [destaqueId, setDestaqueId] = useState<string | null>(null);
  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const cartoesRef = useRef<Map<string, HTMLElement>>(new Map());

  // Deep-link ?foto=id — rola até o card e destaca
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("foto");
    if (!id) return;
    const tentarDestacar = (tentativa: number) => {
      const el = cartoesRef.current.get(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setDestaqueId(id);
        window.setTimeout(() => setDestaqueId((d) => (d === id ? null : d)), 2600);
      } else if (tentativa < 10) {
        window.setTimeout(() => tentarDestacar(tentativa + 1), 400);
      }
    };
    tentarDestacar(0);
  }, []);

  const carregarMais = useCallback(async () => {
    if (!hasMore || carregandoMais) return;
    setCarregandoMais(true);
    try {
      const proxima = pagina + 1;
      const resp = await fetch(`/api/galeria?page=${proxima}&take=${TAKE}`);
      const json = await resp.json();
      const novas: FotoGaleria[] = json.fotos ?? [];
      setFotos((atuais) => {
        const ids = new Set(atuais.map((f) => f.id));
        return [...atuais, ...novas.filter((f) => !ids.has(f.id))];
      });
      setPagina(proxima);
      setHasMore(Boolean(json.hasMore));
    } finally {
      setCarregandoMais(false);
    }
  }, [hasMore, carregandoMais, pagina]);

  useEffect(() => {
    const el = sentinelaRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) carregarMais();
      },
      { rootMargin: "600px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, carregarMais, fotos.length]);

  const alternarCurtida = useCallback(async (foto: FotoGaleria) => {
    if (curtindo.has(foto.id)) return;
    const curtidoAgora = foto.curtido;
    setCurtindo((s) => new Set(s).add(foto.id));
    // Otimista
    setFotos((atuais) =>
      atuais.map((f) =>
        f.id === foto.id
          ? { ...f, curtido: !curtidoAgora, totalCurtidas: f.totalCurtidas + (curtidoAgora ? -1 : 1) }
          : f
      )
    );
    try {
      const resp = await fetch(`/api/galeria/${foto.id}/curtir`, {
        method: curtidoAgora ? "DELETE" : "POST",
      });
      if (!resp.ok) throw new Error("falha");
      const json = await resp.json();
      setFotos((atuais) =>
        atuais.map((f) =>
          f.id === foto.id
            ? { ...f, curtido: Boolean(json.curtido), totalCurtidas: Number(json.total ?? f.totalCurtidas) }
            : f
        )
      );
    } catch {
      // Reverte em caso de erro
      setFotos((atuais) =>
        atuais.map((f) =>
          f.id === foto.id
            ? { ...f, curtido: curtidoAgora, totalCurtidas: foto.totalCurtidas }
            : f
        )
      );
    } finally {
      setCurtindo((s) => {
        const n = new Set(s);
        n.delete(foto.id);
        return n;
      });
    }
  }, [curtindo]);

  const curtirComAnimacao = useCallback((foto: FotoGaleria) => {
    setBigHeartId(foto.id);
    window.setTimeout(() => setBigHeartId((id) => (id === foto.id ? null : id)), 700);
    if (!foto.curtido) alternarCurtida(foto);
  }, [alternarCurtida]);

  const compartilhar = useCallback(async (foto: FotoGaleria) => {
    const url = `${window.location.origin}/galeria?foto=${foto.id}`;
    const texto = foto.legenda ? `${foto.legenda} — Capítulo JBA 512` : "Foto do Capítulo JBA 512";
    if (navigator.share) {
      try {
        await navigator.share({ title: texto, text: texto, url });
        return;
      } catch {
        // usuário cancelou — ignora
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiadoId(foto.id);
      window.setTimeout(() => setCopiadoId((id) => (id === foto.id ? null : id)), 2000);
    } catch {
      window.prompt("Copie o link da foto:", url);
    }
  }, []);

  if (fotos.length === 0) {
    return (
      <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-10 text-center shadow-sm">
        <p className="numeral-watermark mx-auto text-5xl font-black text-[var(--ink)]/10">512</p>
        <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--ink-soft)]">
          As fotos das ações do capítulo aparecerão aqui assim que forem cadastradas pelo painel
          administrativo.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-xs text-[var(--stone)]">
        Mostrando {fotos.length} de {total} fotos · duplo toque na foto para curtir
      </p>

      <div className="mx-auto max-w-xl space-y-6">
        {fotos.map((foto) => (
          <article
            key={foto.id}
            ref={(el) => {
              if (el) cartoesRef.current.set(foto.id, el);
              else cartoesRef.current.delete(foto.id);
            }}
            aria-label={foto.legenda ? `Foto: ${foto.legenda}` : "Foto da galeria"}
            className={`overflow-hidden rounded-[18px] border bg-white shadow-soft transition-shadow ${
              destaqueId === foto.id
                ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/60"
                : "border-[var(--ink-faint)]"
            }`}
          >
            {/* cabeçalho */}
            <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--crimson)] font-display text-xs font-black text-[var(--gold)]">
                512
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[var(--crimson-deep)]">
                  Capítulo JBA N°512
                </p>
                <p className="text-xs text-[var(--stone)]">{formatarData(foto.dataRealizada)}</p>
              </div>
            </div>

            {/* foto */}
            <div
              className="relative aspect-[4/5] w-full cursor-pointer select-none bg-[var(--crimson)]/5"
              onDoubleClick={() => curtirComAnimacao(foto)}
              title="Duplo toque para curtir"
            >
              <Image
                src={foto.url}
                alt={foto.legenda ?? "Foto de ação do capítulo"}
                fill
                sizes="(max-width: 640px) 100vw, 576px"
                className="object-cover"
                loading="lazy"
              />
              {bigHeartId === foto.id && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="animate-ping-once text-white drop-shadow-lg">
                    <Coracao preenchido className="h-20 w-20" />
                  </span>
                </span>
              )}
            </div>

            {/* ações */}
            <div className="px-4 pb-4 pt-3 sm:px-5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => alternarCurtida(foto)}
                  disabled={curtindo.has(foto.id)}
                  aria-pressed={foto.curtido}
                  aria-label={foto.curtido ? "Descurtir foto" : "Curtir foto"}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90 ${
                    foto.curtido
                      ? "text-red-500"
                      : "text-[var(--ink)] hover:bg-red-50 hover:text-red-500"
                  } disabled:opacity-50`}
                >
                  <Coracao preenchido={foto.curtido} className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => compartilhar(foto)}
                  aria-label="Compartilhar foto"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--ink)] transition hover:bg-black/5 active:scale-90"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
                    <path d="M16 6l-4-4-4 4" />
                    <path d="M12 2v13" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                {foto.totalCurtidas} curtida{foto.totalCurtidas === 1 ? "" : "s"}
              </p>
              {foto.legenda && (
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink)]">
                  <span className="mr-2 font-bold text-[var(--crimson-deep)]">cap_jba512</span>
                  {foto.legenda}
                </p>
              )}
              {copiadoId === foto.id && (
                <p className="mt-2 text-xs font-medium text-emerald-600">Link copiado!</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* sentinela infinite scroll */}
      <div ref={sentinelaRef} aria-hidden className="h-4" />
      {carregandoMais && (
        <p className="mt-4 text-center text-xs text-[var(--stone)]">Carregando mais fotos…</p>
      )}
      {!hasMore && fotos.length > TAKE && (
        <p className="mt-4 text-center text-xs text-[var(--stone)]">
          Você viu todas as {total} fotos.
        </p>
      )}

      <style jsx>{`
        @keyframes ping-once {
          0% { transform: scale(0.4); opacity: 0; }
          30% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.7s ease-out forwards;
        }
      `}</style>
    </>
  );
}
