import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { VISITANTE_COOKIE, type FotoGaleria } from "@/lib/galeria";
import GaleriaFeed from "@/components/GaleriaFeed";

export const revalidate = 60;

export const metadata = {
  title: "Galeria | Capítulo José Barreto de Albuquerque N°512",
  description:
    "Todas as fotos das ações filantrópicas, eventos e trabalhos comunitários do Capítulo 512 — curta e compartilhe.",
};

const TAKE_INICIAL = 21;

export default async function GaleriaPage() {
  const visitanteId = cookies().get(VISITANTE_COOKIE)?.value;

  const [total, registros] = await Promise.all([
    prisma.fotoAcao.count(),
    prisma.fotoAcao
      .findMany({
        orderBy: [{ dataRealizada: "desc" }, { criadoEm: "desc" }, { id: "desc" }],
        take: TAKE_INICIAL,
        include: { _count: { select: { curtidas: true } } },
      })
      .catch(() => []),
  ]);

  let curtidasDoVisitante = new Set<string>();
  if (visitanteId && registros.length > 0) {
    const curtidas = await prisma.curtidaFoto
      .findMany({
        where: { fotoAcaoId: { in: registros.map((f) => f.id) }, visitanteId },
        select: { fotoAcaoId: true },
      })
      .catch(() => []);
    curtidasDoVisitante = new Set(curtidas.map((c) => c.fotoAcaoId));
  }

  const iniciais: FotoGaleria[] = registros.map((f) => ({
    id: f.id,
    url: f.url,
    legenda: f.legenda,
    dataRealizada: f.dataRealizada.toISOString(),
    totalCurtidas: f._count.curtidas,
    curtido: curtidasDoVisitante.has(f.id),
  }));

  return (
    <main className="bg-[var(--paper-2)]">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/#acoes"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4 hover:text-[var(--crimson-deep)]"
        >
          <span aria-hidden>←</span> Voltar para Nossas ações
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Registros
            </p>
            <h1 className="mt-1 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
              Galeria
            </h1>
            <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-[var(--ink-soft)]">
              Todas as fotos das atividades do capítulo, das mais recentes às mais antigas.
              Toque para ampliar e curta suas favoritas.
            </p>
          </div>
          {total > 0 && (
            <p className="rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
              {total} foto{total > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="mt-8">
          <GaleriaFeed iniciais={iniciais} total={total} inicialHasMore={iniciais.length < total} />
        </div>
      </section>
    </main>
  );
}
