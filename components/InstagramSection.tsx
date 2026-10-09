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
      {/* Glow radial sutil em dourado no fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_50%,rgba(201,162,39,0.06),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
        {/* Esquerda – Editorial */}
        <div className="w-full min-w-0 lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Acompanhe o dia a dia
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            Nosso dia a dia
            <br />
            <span className="font-normal italic text-[var(--ink)]/75">
              no Instagram
            </span>
          </h2>

          <div className="mt-4 h-0.5 w-12 bg-gradient-to-r from-[var(--gold)] to-transparent" />

          <p className="mt-4 max-w-prose text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
            Bastidores das reuniões, ações filantrópicas e conquistas do
            Capítulo José Barreto de Albuquerque N°512 — tudo em tempo real no
            nosso feed oficial.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Instagram do Capítulo José Barreto de Albuquerque N°512 em nova aba — @cap_jba512"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[var(--gold)] px-7 py-3.5 text-[14px] font-semibold text-[var(--crimson-deep)] shadow-soft transition-all hover:bg-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-strong"
            >
              <InstagramIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>@cap_jba512</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* Direita – Card Editorial elevado com restrição estrita de largura */}
        <div className="w-full min-w-0 lg:col-span-5">
          <div className="group relative w-full min-w-0 overflow-hidden rounded-[22px] border border-[var(--gold-border)] bg-white p-5 shadow-soft transition-all duration-500 hover:border-[var(--gold)]/50 hover:shadow-strong sm:p-7">
            {/* Detalhe Dourado no topo do Card */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--gold)]/20 via-[var(--gold)] to-[var(--gold)]/20" />

            {/* Losango decorativo */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -top-3 h-7 w-7 rotate-45 border border-[var(--gold)]/20 bg-[var(--gold-faint)] transition-colors group-hover:bg-[var(--gold)]/20"
            />

            <div className="flex items-center justify-between border-b border-[var(--ink-faint)] pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                Conteúdo Exclusivo
              </p>
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
            </div>

            {/* Lista com losangos no lugar dos pontos padrão */}
            <ul className="mt-5 space-y-3.5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[var(--gold)]">
                  ◆
                </span>
                <span className="min-w-0 flex-1">
                  Fotos das instalações, iniciações e cerimónias.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[var(--gold)]">
                  ◆
                </span>
                <span className="min-w-0 flex-1">
                  Reels e stories de ações comunitárias e eventos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[var(--gold)]">
                  ◆
                </span>
                <span className="min-w-0 flex-1">
                  Avisos e convites para famílias e interessados.
                </span>
              </li>
            </ul>

            {/* Widget de Perfil do Instagram */}
            <div className="mt-7 flex items-center justify-between gap-3 rounded-[16px] border border-[var(--gold-border)]/60 bg-[var(--paper-2)] p-3.5 shadow-inner">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--gold)] to-[var(--crimson)] text-white shadow-sm">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold leading-none text-[var(--crimson-deep)]">
                    @cap_jba512
                  </p>
                  <p className="mt-1 truncate text-[11px] text-[var(--ink-soft)]">
                    Ordem DeMolay · N°512
                  </p>
                </div>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguir @cap_jba512 no Instagram"
                className="inline-flex shrink-0 items-center rounded-full bg-[var(--crimson)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--crimson-deep)] hover:shadow"
              >
                Seguir
              </a>
            </div>

            <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--stone)]">
              Perfil oficial no Instagram
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
