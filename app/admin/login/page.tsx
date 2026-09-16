"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginAdminPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);

    const dados = new FormData(evento.currentTarget);
    const resultado = await signIn("credentials", {
      email: dados.get("email"),
      senha: dados.get("senha"),
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] bg-[var(--crimson-deep)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(201,162,39,0.09),transparent_60%)]" aria-hidden />
      <div className="numeral-watermark pointer-events-none absolute bottom-0 right-0 select-none text-[22vw] font-black leading-none text-white/[0.04]" aria-hidden>
        512
      </div>

      <section className="relative mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6 py-16">
        <div className="rounded-[18px] border border-[var(--gold)]/20 bg-[var(--paper)] p-8 shadow-strong">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/30 bg-[var(--crimson-deep)] font-display text-xs font-bold text-[var(--gold)]">
              512
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold leading-none tracking-tight text-[var(--crimson)]">
                Painel admin
              </h1>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]/40">Capítulo N°512</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            Acesso restrito à diretoria e comissão de análise.
          </p>
          <div className="divider-diamond my-4">
            <span>◆</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
              />
            </div>

            {erro && (
              <p role="alert" className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-[var(--crimson-deep)] disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-white/45">Use as credenciais criadas via `npm run criar-admin`.</p>
      </section>
    </div>
  );
}
