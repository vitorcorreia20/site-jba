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
            Preencha o formulário abaixo para solicitar sua admissão ao Capítulo José Barreto de Albuquerque N°512. Sua
            solicitação será encaminhada à comissão de análise do capítulo e respondida em até 48h.
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
            <h2 className="font-display text-lg font-semibold text-[var(--crimson)]">Seus dados</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              Campos com <span className="font-semibold text-[var(--crimson)]">*</span> são obrigatórios. Se for menor
              de idade, informe o responsável.
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
                  <strong className="font-semibold text-white">23 anos, 46 gestões:</strong> tradição viva de formação de
                  líderes, semestre após semestre.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/70" />
                <span>
                  <strong className="font-semibold text-white">Civismo e fraternidade:</strong> ações comunitárias,
                  oratória e trabalho em equipe.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/50" />
                <span>
                  <strong className="font-semibold text-white">Sem custo para se candidatar:</strong> a comissão analisa
                  e retorna com próximos passos.
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
                { n: "01", t: "Envio", d: "Você preenche o formulário ao lado." },
                { n: "02", t: "Análise", d: "Comissão avalia e entra em contato." },
                { n: "03", t: "Convite", d: "Conversa com família e integração." },
              ].map((p) => (
                <li key={p.n} className="flex gap-3 rounded-xl border border-white bg-white px-3 py-3 shadow-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--crimson)] text-[11px] font-bold text-white">
                    {p.n}
                  </span>
                  <span>
                    <span className="font-semibold text-[var(--ink)]">{p.t}:</span>{" "}
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

          {/* Contato direto */}
          <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-6">
            <p className="font-display text-sm font-semibold text-[var(--crimson)]">Prefere falar direto?</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">
              Entre em contato com a diretoria pelo painel ou redes do capítulo.
            </p>
            <p className="mt-3 text-xs text-[var(--ink)]/40">
              [Espaço para telefone/WhatsApp/Instagram da diretoria]
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
