const INSTAGRAM_URL = "https://www.instagram.com/cap_jba512";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function InstagramSection() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--gold-border)] bg-[var(--paper)]">
      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
        {/* Esquerda – editorial */}
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Acompanhe o dia a dia
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            Nosso dia a dia
            <br />
            <span className="font-normal italic text-[var(--ink)]/70">no Instagram</span>
          </h2>
          <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Bastidores de reuniões, ações filantrópicas e conquistas do Capítulo José Barreto de Albuquerque
            N°512 — tudo em tempo real no feed oficial.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Instagram do Capítulo José Barreto de Albuquerque N°512 em nova aba — @cap_jba512"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3 text-[14px] font-semibold text-[var(--crimson-deep)] shadow-soft transition-all hover:bg-[var(--gold-light)] hover:-translate-y-px hover:shadow-strong"
            >
              <InstagramIcon className="h-[18px] w-[18px]" />
              @cap_jba512
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Direita – card crimson editorial (espelho do Apoie mas claro) */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white p-6 shadow-soft sm:p-7">
            {/* losango decorativo */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 rotate-45 border border-[var(--gold)]/15 bg-[var(--gold-faint)]"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
              No feed oficial
            </p>
            <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-[var(--ink-soft)]">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>Fotos das instalações, iniciações e homenagens.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/70" />
                <span>Reels e stories de ações comunitárias e eventos.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/50" />
                <span>Avisos e convites para famílias e interessados.</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3 rounded-[14px] border border-[var(--gold-border)]/60 bg-[var(--gold-faint)] px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--crimson)] text-white">
                <InstagramIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none text-[var(--crimson)]">@cap_jba512</p>
                <p className="mt-1 text-xs leading-none text-[var(--ink)]/60">Cap. José Barreto de Albuquerque N°512</p>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguir @cap_jba512 no Instagram"
                className="ml-auto inline-flex shrink-0 items-center rounded-full border border-[var(--crimson)]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--crimson)] transition-colors hover:bg-[var(--crimson)] hover:text-white"
              >
                Seguir
              </a>
            </div>

            <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wide text-[var(--ink)]/40">
              Instagram oficial do capítulo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
