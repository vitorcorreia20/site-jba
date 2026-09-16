import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const metadata = {
  title: "Quadro de lideranças | Capítulo José Barreto de Albuquerque N°512",
};

function extrairAno(periodo: string): string {
  const m = periodo.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : periodo.slice(0, 4);
}

type Mestre = { id: string; nome: string; fotoUrl: string | null; periodo: string; ordem: number; criadoEm: Date };

export default async function LiderancaPage() {
  const mestres = (await prisma.mestreConselheiro
    .findMany({ orderBy: { ordem: "asc" } })
    .catch(() => [])) as Mestre[];

  // Agrupa por ano para dar respiro em 46 gestões
  const grupos = (mestres as typeof mestres).reduce<Record<string, typeof mestres>>((acc, m) => {
    const ano = extrairAno(m.periodo);
    if (!acc[ano]) acc[ano] = [];
    acc[ano].push(m);
    return acc;
  }, {});

  const anosOrdenados = Object.keys(grupos).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Se periodo não segue padrão, fallback para lista simples
  const usarGrupos = anosOrdenados.length > 1 && anosOrdenados.length < mestres.length;

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
            <span className="font-normal italic text-[var(--ink)]/70">23 anos, 46 gestões.</span>
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

      {/* Conteúdo */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {mestres.length > 0 ? (
          usarGrupos ? (
            <div className="space-y-10">
              {anosOrdenados.map((ano) => (
                <div key={ano} className="relative">
                  {/* sticky ano – âncora visual */}
                  <div className="sticky top-[57px] z-10 -mx-6 border-y border-[var(--gold-border)] bg-[var(--paper)]/85 px-6 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
                    <div className="flex items-center gap-3">
                      <span className="numeral-watermark text-2xl font-black leading-none text-[var(--crimson)]/10">
                        {ano}
                      </span>
                      <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-[var(--crimson)]">
                        {ano}
                      </h2>
                      <span className="h-px flex-1 bg-[var(--gold-border)]" />
                      <span className="text-xs font-medium text-[var(--ink)]/40">
                        {grupos[ano].length} gestão{grupos[ano].length > 1 ? "es" : ""}
                      </span>
                    </div>
                  </div>

                  <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                    {grupos[ano].map((mestre, idx) => (
                      <li
                        key={mestre.id}
                        className="group relative flex gap-4 rounded-[16px] border border-[var(--ink-faint)] bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft"
                      >
                        <span className="absolute -left-px top-4 hidden h-8 w-0.5 rounded-full bg-[var(--gold)]/40 sm:block" />
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[var(--gold)]/20 bg-[var(--paper-2)]">
                          {mestre.fotoUrl ? (
                            <Image
                              src={mestre.fotoUrl}
                              alt={mestre.nome}
                              fill
                              sizes="56px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center font-display text-lg font-bold text-[var(--crimson)]/30">
                              {mestre.nome.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[15px] font-semibold leading-tight text-[var(--crimson)]">
                            {mestre.nome}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink)]/60">
                            <span className="h-1 w-1 rounded-full bg-[var(--gold)]" />
                            {mestre.periodo}
                          </p>
                          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--ink)]/30">
                            Gestão {String(mestre.ordem ?? idx + 1).padStart(2, "0")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            // Fallback lista simples timeline editorial
            <ol className="relative space-y-4 border-l border-[var(--gold)]/20 pl-6 sm:pl-8">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[var(--gold)]/30 via-[var(--gold)]/10 to-transparent" />
              {mestres.map((mestre, indice) => (
                <li key={mestre.id} className="group relative">
                  <span
                    aria-hidden
                    className="absolute -left-[29px] top-5 h-2.5 w-2.5 rounded-full border-2 border-[var(--paper)] bg-[var(--gold)] shadow ring-4 ring-[var(--gold-faint)] sm:-left-[37px]"
                  />
                  <div className="flex gap-4 rounded-[16px] border border-[var(--ink-faint)] bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[var(--gold)]/20 bg-[var(--paper-2)]">
                      {mestre.fotoUrl ? (
                        <Image
                          src={mestre.fotoUrl}
                          alt={mestre.nome}
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center font-display text-lg font-bold text-[var(--crimson)]/30">
                          {mestre.nome.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-[15px] font-semibold leading-tight text-[var(--crimson)]">
                        {mestre.nome}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-[var(--ink)]/60">{mestre.periodo}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--ink)]/30">
                        #{String(indice + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-10 text-center shadow-sm">
            <p className="numeral-watermark mx-auto text-5xl font-black text-[var(--ink)]/10">512</p>
            <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-[var(--ink-soft)]">
              O histórico de Mestres Conselheiros aparecerá aqui assim que for cadastrado pelo painel administrativo. São 46
              gestões para contar 23 anos de história.
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
