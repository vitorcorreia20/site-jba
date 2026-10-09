import Link from "next/link";
import FormularioAdmissao from "@/components/FormularioAdmissao";

export const metadata = {
  title: "Quero fazer parte | Capítulo José Barreto de Albuquerque N°512",
};

export default function QueroFazerPartePage() {
  return (
    <div className="bg-[var(--paper)]">
      {/* Header editorial */}
      <section className="border-b border-[var(--gold-border)] bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Processo de admissão
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            Quero fazer parte
          </h1>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Preencha o formulário abaixo para solicitar sua admissão ao Capítulo
            José Barreto de Albuquerque N°512. Sua solicitação será encaminhada
            à comissão de análise do capítulo e respondida em até 48h.
          </p>
          <div className="divider-diamond mt-6 max-w-md">
            <span>◆</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12">
        {/* Esquerda – Formulário (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-[18px] border border-[var(--ink-faint)] bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-lg font-semibold text-[var(--crimson)]">
              Seus dados
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              Campos com{" "}
              <span className="font-semibold text-[var(--crimson)]">*</span> são
              obrigatórios. Se for menor de idade, informe o responsável.
            </p>
            <div className="mt-6">
              <FormularioAdmissao />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--ink)]/40">
            Seus dados são usados apenas pela comissão de análise do capítulo.
          </p>
        </div>

        {/* Direita – Prova social / sticky (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Card benefício crimson */}
          <div className="relative overflow-hidden rounded-[18px] border border-[var(--gold)]/20 bg-[var(--crimson-deep)] p-6 text-white shadow-strong">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--gold)]/10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold-light)]">
              Por que o 512?
            </p>
            <ul className="mt-4 space-y-4 text-sm leading-relaxed text-white/85">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>
                  <strong className="font-semibold text-white">
                    23 anos, 46 gestões:
                  </strong>{" "}
                  tradição viva de formação de líderes, semestre após semestre.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/70" />
                <span>
                  <strong className="font-semibold text-white">
                    Civismo e fraternidade:
                  </strong>{" "}
                  ações comunitárias, oratória e trabalho em equipe.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/50" />
                <span>
                  <strong className="font-semibold text-white">
                    Sem custo para se candidatar:
                  </strong>{" "}
                  a comissão analisa e retorna com próximos passos.
                </span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/60">
              <span className="h-px w-6 bg-white/20" />
              Resposta da diretoria em até 48h
            </div>
          </div>

          {/* Passos */}
          <div className="rounded-[18px] border border-[var(--ink-faint)] bg-[var(--paper-2)] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]/40">
              Como funciona
            </p>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                {
                  n: "01",
                  t: "Envio",
                  d: "Você preenche o formulário ao lado.",
                },
                {
                  n: "02",
                  t: "Análise",
                  d: "Comissão avalia e entra em contato.",
                },
                {
                  n: "03",
                  t: "Convite",
                  d: "Conversa com família e integração.",
                },
              ].map((p) => (
                <li
                  key={p.n}
                  className="flex gap-3 rounded-xl border border-white bg-white px-3 py-3 shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--crimson)] text-[11px] font-bold text-white">
                    {p.n}
                  </span>
                  <span>
                    <span className="font-semibold text-[var(--ink)]">
                      {p.t}:
                    </span>{" "}
                    <span className="text-[var(--ink-soft)]">{p.d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link
              href="/lideranca"
              className="mt-4 inline-flex text-xs font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4"
            >
              Conheça nossa história <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Contato direto (WhatsApp e Instagram) */}
          <div className="rounded-[18px] border border-[var(--gold-border)] bg-white p-6 shadow-sm">
            <p className="font-display text-sm font-semibold text-[var(--crimson)]">
              Prefere falar direto?
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-soft)]">
              Envie uma mensagem à nossa diretoria e tire as suas dúvidas.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              {/* Botão WhatsApp */}
              <a
                href="https://wa.me/5586999857004"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 hover:shadow"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Conversar no WhatsApp
              </a>

              {/* Botão Instagram */}
              <a
                href="https://www.instagram.com/cap_jba512"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl border border-[var(--crimson)]/20 bg-[var(--paper-2)] px-4 py-2.5 text-[13px] font-semibold text-[var(--crimson)] shadow-sm transition-all hover:bg-[var(--crimson)] hover:text-white"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1.2"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
                Acessar Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
