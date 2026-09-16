import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
            Jovens atualmente ativos no Capítulo José Barreto de Albuquerque N°512 — ordenados por ID DeMolay crescente.
            Cada card revela cargo, foto e prêmios.
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
          <ul className="overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-soft">
            {membros.map((membro, idx) => (
              <li
                key={membro.id}
                className="group flex items-center gap-4 border-b border-[var(--ink-faint)] px-4 py-4 last:border-0 hover:bg-[var(--paper-2)]/50 sm:px-5"
                style={{ borderLeft: idx % 2 === 0 ? "3px solid transparent" : "3px solid rgba(201,162,39,0.18)" }}
              >
                <span className="hidden shrink-0 font-display text-xs font-bold tracking-wide text-[var(--ink)]/15 sm:block">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <span className="shrink-0 rounded-full bg-[var(--crimson)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow">
                  #{membro.idDemolay}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[15px] font-semibold leading-tight text-[var(--ink)]">
                    {membro.nome}
                  </p>
                  <p className="truncate text-xs font-medium text-[var(--ink)]/50">
                    {membro.cargoAtual ? (
                      <span className="uppercase tracking-wide text-[var(--gold)]">{membro.cargoAtual}</span>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>

                {membro.fotoUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--gold)]/15 bg-[var(--paper-2)]">
                    <Image
                      src={membro.fotoUrl}
                      alt={membro.nome}
                      fill
                      sizes="40px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                ) : (
                  <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--ink-faint)] bg-[var(--paper-2)] font-display text-sm font-bold text-[var(--ink)]/30 sm:flex">
                    {membro.nome.charAt(0)}
                  </span>
                )}

                {membro.premios.length > 0 && (
                  <div className="hidden items-center gap-1.5 sm:flex">
                    {membro.premios.slice(0, 3).map((pr) => (
                      <div
                        key={pr.id}
                        className="relative h-7 w-7 overflow-hidden rounded-[8px] border border-[var(--ink-faint)] bg-[var(--paper-2)]"
                        title={pr.legenda ?? ""}
                      >
                        <Image src={pr.imagemUrl} alt={pr.legenda ?? "Prêmio"} fill sizes="28px" className="object-cover" />
                      </div>
                    ))}
                    {membro.premios.length > 3 && (
                      <span className="rounded-full bg-[var(--paper-2)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--ink)]/40">
                        +{membro.premios.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
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
