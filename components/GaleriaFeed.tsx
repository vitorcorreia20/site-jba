"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [selecionadaId, setSelecionadaId] = useState<string | null>(null);
  const [curtindo, setCurtindo] = useState<Set<string>>(new Set());
  const [bigHeartId, setBigHeartId] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const sentinelaRef = useRef<HTMLDivElement | null>(null);

  const selecionadaIndex = useMemo(
    () => fotos.findIndex((f) => f.id === selecionadaId),
    [fotos, selecionadaId]
  );
  const selecionada = selecionadaIndex >= 0 ? fotos[selecionadaIndex] : null;

  // Deep-link ?foto=id — abre o modal ao entrar / compartilhar
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("foto");
    if (id && fotos.some((f) => f.id === id)) {
      setSelecionadaId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza URL com modal aberto
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selecionadaId) {
      url.searchParams.set("foto", selecionadaId);
    } else {
      url.searchParams.delete("foto");
    }
    window.history.replaceState(null, "", url.toString());
  }, [selecionadaId]);

  // Trava scroll + teclado no modal
  useEffect(() => {
    if (!selecionada) return;
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelecionadaId(null);
      if (e.key === "ArrowRight")
        setSelecionadaId(fotos[Math.min(fotos.length - 1, selecionadaIndex + 1)]?.id ?? null);
      if (e.key === "ArrowLeft")
        setSelecionadaId(fotos[Math.max(0, selecionadaIndex - 1)]?.id ?? null);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [selecionada, selecionadaIndex, fotos]);

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
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
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
        Mostrando {fotos.length} de {total} fotos · toque para ampliar, duplo toque para curtir
      </p>

      <div className="grid grid-cols-3 gap-1 sm:gap-3">
        {fotos.map((foto) => (
          <button
            key={foto.id}
            type="button"
            onClick={() => setSelecionadaId(foto.id)}
            onDoubleClick={() => curtirComAnimacao(foto)}
            aria-label={foto.legenda ? `Ampliar foto: ${foto.legenda}` : "Ampliar foto da galeria"}
            className="group relative aspect-square overflow-hidden bg-[var(--crimson)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] sm:rounded-[14px] sm:border sm:border-[var(--ink-faint)] sm:shadow-soft"
          >
            <Image
              src={foto.url}
              alt={foto.legenda ?? "Foto de ação do capítulo"}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 30vw, 360px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            {/* selo de curtido */}
            {foto.curtido && (
              <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-red-400 backdrop-blur">
                <Coracao preenchido className="h-3.5 w-3.5" />
              </span>
            )}
            {/* overlay hover (desktop) */}
            <span className="pointer-events-none absolute inset-0 hidden items-center justify-center gap-2 bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
              <Coracao preenchido={foto.curtido} className="h-5 w-5" />
              <span className="text-sm font-bold">{foto.totalCurtidas}</span>
            </span>
            {/* contador mobile */}
            <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur sm:hidden">
              <Coracao preenchido={foto.curtido} className="h-3 w-3" />
              {foto.totalCurtidas}
            </span>
            {/* coração gigante do duplo-toque */}
            {bigHeartId === foto.id && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="animate-ping-once text-white drop-shadow-lg">
                  <Coracao preenchido className="h-16 w-16" />
                </span>
              </span>
            )}
          </button>
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

      {/* ============ MODAL estilo Instagram ============ */}
      {selecionada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selecionada.legenda ?? "Foto ampliada da galeria"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelecionadaId(null)}
        >
          <div
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[18px] bg-white shadow-strong md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* foto */}
            <div className="relative aspect-square bg-black md:col-span-7 md:aspect-auto md:min-h-[480px]">
              <Image
                src={selecionada.url}
                alt={selecionada.legenda ?? "Foto de ação do capítulo"}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain bg-black"
                priority
              />
              {fotos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Foto anterior"
                    onClick={() =>
                      setSelecionadaId(fotos[Math.max(0, selecionadaIndex - 1)]?.id ?? null)
                    }
                    disabled={selecionadaIndex <= 0}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima foto"
                    onClick={() =>
                      setSelecionadaId(
                        fotos[Math.min(fotos.length - 1, selecionadaIndex + 1)]?.id ?? null
                      )
                    }
                    disabled={selecionadaIndex >= fotos.length - 1}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 disabled:opacity-30"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* lateral */}
            <div className="flex flex-col p-5 sm:p-6 md:col-span-5">
              <div className="flex items-center gap-3 border-b border-[var(--ink-faint)] pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--crimson)] font-display text-xs font-black text-[var(--gold)]">
                  512
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--crimson-deep)]">
                    Capítulo JBA N°512
                  </p>
                  <p className="text-xs text-[var(--stone)]">{formatarData(selecionada.dataRealizada)}</p>
                </div>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setSelecionadaId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--stone)] transition hover:bg-black/5 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {selecionada.legenda && (
                <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink)]">
                  {selecionada.legenda}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alternarCurtida(selecionada)}
                  disabled={curtindo.has(selecionada.id)}
                  aria-pressed={selecionada.curtido}
                  aria-label={selecionada.curtido ? "Descurtir foto" : "Curtir foto"}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90 ${
                    selecionada.curtido
                      ? "text-red-500"
                      : "text-[var(--ink)] hover:bg-red-50 hover:text-red-500"
                  } disabled:opacity-50`}
                >
                  <Coracao preenchido={selecionada.curtido} className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => compartilhar(selecionada)}
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
                {selecionada.totalCurtidas} curtida{selecionada.totalCurtidas === 1 ? "" : "s"}
              </p>
              {copiado && (
                <p className="mt-2 text-xs font-medium text-emerald-600">Link copiado!</p>
              )}
              <p className="mt-2 text-xs text-[var(--stone)]">
                {selecionadaIndex + 1} de {fotos.length}
                {total > fotos.length ? ` (carregando de ${total})` : ""}
              </p>
            </div>
          </div>
        </div>
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
