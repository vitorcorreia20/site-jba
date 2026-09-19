import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getGestoes, getIdadeCapitulo } from "@/lib/capitulo";

export const revalidate = 60;
export const metadata = {
  title: "Quadro de lideranças | Capítulo José Barreto de Albuquerque N°512",
};

function parseGestao(periodo: string): number {
  // Formato canônico AAAA.S : 2026.1 -> 20261 , 2026.2 -> 20262
  const m = periodo.match(/^(\d{4})\.([12])$/);
  if (m) return Number(m[1]) * 10 + Number(m[2]);
  // Fallback legado: tenta extrair ano solto "2023" / "2023/2024" / "2023.1"
  const y = periodo.match(/\b(19|20)\d{2}\b/);
  if (y) {
    const sem = periodo.includes(".2") ? 2 : periodo.includes(".1") ? 1 : 0;
    return Number(y[0]) * 10 + sem;
  }
  return 0;
}

type Mestre = { id: string; nome: string; fotoUrl: string | null; periodo: string; ordem: number; criadoEm: Date };

export default async function LiderancaPage() {
  const idade = getIdadeCapitulo();
  const gestoes = getGestoes();
  const mestresRaw = (await prisma.mestreConselheiro
    .findMany({ orderBy: { ordem: "asc" } })
    .catch(() => [])) as Mestre[];

  // Ordena por gestão decrescente: mais recentes no topo (2026.2 > 2026.1 > 2025.2)
  const mestres = [...mestresRaw].sort(
    (a, b) => parseGestao(b.periodo) - parseGestao(a.periodo) || b.ordem - a.ordem
  );

  return (
    <div className="bg-[var(--paper)]">
      {/* Header editorial solene */}
      <section className="border-b border-[var(--gold-border)] bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Quadro de lideranças
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            Mestres Conselheiros
            <br />
            <span className="font-normal italic text-[var(--ink)]/70">{idade} anos, {gestoes} gestões.</span>
          </h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Todos os Mestres Conselheiros que já conduziram o Capítulo José Barreto de Albuquerque N°512, em ordem
            cronológica — cada semestre, um novo jovem à frente do capítulo.
          </p>
          <div className="divider-diamond mt-6 max-w-md">
            <span>◆</span>
          </div>

          {mestres.length > 0 && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              {mestres.length} gestões registradas
            </p>
          )}
        </div>
      </section>

      {/* Conteúdo — Galeria */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {mestres.length > 0 ? (
          <div className="grid gap-5 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {mestres.map((mestre) => (
              <article
                key={mestre.id}
                className="group flex flex-col overflow-hidden rounded-[16px] border border-[var(--ink-faint)] bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-strong"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--paper-2)]">
                  {mestre.fotoUrl ? (
                    <Image
                      src={mestre.fotoUrl}
                      alt={mestre.nome}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 18vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white font-display text-2xl font-bold text-[var(--crimson)]/20">
                        {mestre.nome.charAt(0)}
                      </span>
                      <span className="text-xs text-[var(--ink)]/40">Sem foto</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 p-3 text-center">
                  <p className="font-display line-clamp-2 text-sm font-semibold leading-tight text-[var(--crimson)]">
                    {mestre.nome}
                  </p>
                  <p className="inline-flex rounded-full bg-[var(--gold-faint)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--crimson)]">
                    Gestão {mestre.periodo}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-10 text-center shadow-sm">
            <p className="numeral-watermark mx-auto text-5xl font-black text-[var(--ink)]/10">512</p>
            <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-[var(--ink-soft)]">
              O histórico de Mestres Conselheiros aparecerá aqui assim que for cadastrado pelo painel administrativo. São {gestoes}
              gestões para contar {idade} anos de história.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4"
            >
              Voltar à Home <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
