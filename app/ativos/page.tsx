import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AtivosClient from "@/components/AtivosClient";

export const revalidate = 60;
export const metadata = {
  title: "Quadro de ativos | Capítulo José Barreto de Albuquerque N°512",
};

export default async function AtivosPage() {
  const raw = await prisma.membro
    .findMany({
      where: { tipo: "ATIVO", ativo: true },
      include: { premios: { orderBy: { ordem: "asc" } } },
    })
    .catch(() => []);
  const membros = raw.sort((a, b) =>
    a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
  );

  return (
    <div className="bg-[var(--paper)]">
      <section className="border-b border-[var(--gold-border)] bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Quadro de ativos
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            Membros ativos
          </h1>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Jovens atualmente ativos no Capítulo José Barreto de Albuquerque N°512 — ordenados por ID DeMolay crescente. Toque em
            qualquer card para abrir o cartão completo com foto ampliada, histórico e prêmios.
          </p>
          <div className="divider-diamond mt-6 max-w-md">
            <span>◆</span>
          </div>
          {membros.length > 0 && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              {membros.length} {membros.length === 1 ? "ativo" : "ativos"}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {membros.length > 0 ? (
          <AtivosClient membros={membros} />
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-10 text-center shadow-sm">
            <p className="numeral-watermark mx-auto text-5xl font-black text-[var(--ink)]/10">512</p>
            <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--ink-soft)]">
              A lista de membros ativos aparecerá aqui assim que for cadastrada pelo painel administrativo. Ordenação
              automática por ID DeMolay crescente.
            </p>
            <Link
              href="/diretoria"
              className="mt-4 inline-flex text-sm font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4"
            >
              Ver diretoria <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
