import Link from "next/link";
import FormularioContato from "@/components/FormularioContato";

export const metadata = {
  title: "Contato | Capítulo José Barreto de Albuquerque N°512",
};

export default function ContatoPage() {
  return (
    <div className="bg-[var(--paper)]">
      <section className="border-b border-[var(--gold-border)] bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Fale com a diretoria</p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">Contato</h1>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--ink-soft)]">Envie sua mensagem, dúvida ou sugestão. A diretoria responde pelo WhatsApp em até 48h.</p>
          <div className="divider-diamond mt-6 max-w-md"><span>◆</span></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="rounded-[18px] border border-[var(--ink-faint)] bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-lg font-semibold text-[var(--crimson)]">Envie sua mensagem</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">Preencha nome, telefone e descrição.</p>
            <div className="mt-6"><FormularioContato /></div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="relative overflow-hidden rounded-[18px] border border-[var(--gold)]/20 bg-[var(--crimson-deep)] p-6 text-white shadow-strong">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--gold)]/10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold-light)]">Como respondemos</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/85">
              <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" /><span>Mensagem vai direto para a diretoria.</span></li>
              <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]/70" /><span>Resposta em até 48h via WhatsApp.</span></li>
            </ul>
          </div>
          <div className="rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-6">
            <p className="font-display text-sm font-semibold text-[var(--crimson)]">Quero fazer parte?</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">Se sua intenção é ingressar no capítulo, use o formulário de admissão.</p>
            <Link href="/quero-fazer-parte" className="mt-3 inline-flex text-xs font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4">Ir para Quero fazer parte →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
