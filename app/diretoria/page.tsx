import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MemberCard from "@/components/MemberCard";

export const revalidate = 60;
export const metadata = {
  title: "Diretoria | Capítulo José Barreto de Albuquerque N°512",
};

export default async function DiretoriaPage() {
  const raw = await prisma.membro
    .findMany({
      where: { tipo: "DIRETORIA", ativo: true },
      include: { premios: { orderBy: { ordem: "asc" } } },
    })
    .catch(() => []);
  const membros = raw.sort((a, b) =>
    a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
  );

  return (
    <div className="bg-[var(--paper)]">
      <section className="border-b border-[var(--gold-border)] bg-[var(--paper-2)]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Diretoria</p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            Quem conduz o capítulo
          </h1>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Conheça os membros da diretoria — ordenados por ID DeMolay crescente. Foto, cargo atual, histórico e prêmios
            exibidos como imagem.
          </p>
          <div className="divider-diamond mt-6 max-w-md">
            <span>◆</span>
          </div>
          {membros.length > 0 && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              {membros.length} {membros.length === 1 ? "membro" : "membros"} na diretoria
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {membros.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {membros.map((membro, idx) => (
              <div key={membro.id} className={idx % 3 === 1 ? "lg:translate-y-4" : ""}>
                <MemberCard
                  idDemolay={membro.idDemolay}
                  nome={membro.nome}
                  fotoUrl={membro.fotoUrl}
                  cargoAtual={membro.cargoAtual}
                  historicoCargos={membro.historicoCargos}
                  premios={membro.premios}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-10 text-center shadow-sm">
            <p className="numeral-watermark mx-auto text-5xl font-black text-[var(--ink)]/10">512</p>
            <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--ink-soft)]">
              Os cards da diretoria aparecerão aqui assim que forem cadastrados pelo painel administrativo.
            </p>
            <Link
              href="/ativos"
              className="mt-4 inline-flex text-sm font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4"
            >
              Ver quadro de ativos <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
