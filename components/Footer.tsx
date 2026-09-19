import Link from "next/link";
import { getGestoes, getIdadeCapitulo } from "@/lib/capitulo";

export default function Footer() {
  const idade = getIdadeCapitulo();
  const gestoes = getGestoes();
  return (
    <footer className="relative overflow-hidden bg-[var(--crimson-deep)] text-[var(--paper)]">
      {/* watermark 512 */}
      <div
        aria-hidden
        className="numeral-watermark pointer-events-none absolute -right-6 bottom-0 select-none text-[28vw] font-black leading-none text-white/[0.04] sm:text-[20vw] lg:text-[16vw]"
      >
        512
      </div>

      {/* grain sutil via pseudo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      {/* hairline topo */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/25 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-12 text-sm sm:grid-cols-12 lg:py-14">
        {/* Col 1 – Identidade */}
        <div className="sm:col-span-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-white/5 font-display text-sm font-bold text-[var(--gold)]">
              512
            </span>
            <p className="font-display text-[15px] font-semibold leading-tight">
              Capítulo José Barreto
              <br />
              <span className="font-normal text-white/80">de Albuquerque N°512</span>
            </p>
          </div>
          <p className="mt-4 max-w-[32ch] text-[13px] leading-relaxed text-white/70">
            Formando jovens líderes através do civismo, da fraternidade e do caráter — há {idade} anos servindo nossa comunidade.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold-light)]/90">
            <span className="h-px w-6 bg-[var(--gold)]/40" />
            {idade} anos · {gestoes} gestões
          </p>
        </div>

        {/* Col 2 – Navegação */}
        <nav aria-label="Rodapé" className="sm:col-span-3 sm:col-start-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Navegação
          </p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-[var(--gold-light)]">
                Início
              </Link>
            </li>
            <li>
              <Link href="/lideranca" className="transition-colors hover:text-[var(--gold-light)]">
                Quadro de lideranças
              </Link>
            </li>
            <li>
              <Link href="/ativos" className="transition-colors hover:text-[var(--gold-light)]">
                Quadro de ativos
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3 – Conversão */}
        <div className="sm:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Faça parte
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-white/70">
            Quer trilhar esse caminho? Fale com a diretoria e conheça o processo de admissão.
          </p>
          <Link
            href="/quero-fazer-parte"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-white/5 px-4 py-2 text-[13px] font-medium text-[var(--gold-light)] backdrop-blur transition-colors hover:bg-[var(--gold)] hover:text-[var(--crimson-deep)] hover:border-[var(--gold)]"
          >
            Quero fazer parte <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-[11px] leading-relaxed text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Capítulo José Barreto de Albuquerque N°512 — Ordem DeMolay · Juventude, liderança e caráter.</p>
          <p className="text-white/30">Site institucional · Atualizado periodicamente</p>
        </div>
      </div>
    </footer>
  );
}
