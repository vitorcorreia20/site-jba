"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      setErro("E-mail ou senha inválidos. Verifique as suas credenciais.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen bg-[var(--paper)] lg:bg-transparent">
      {/* LADO ESQUERDO: Branding Editorial (Oculto em dispositivos móveis) */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-[var(--crimson-deep)] px-12 py-16 lg:flex lg:w-1/2 xl:px-20">
        {/* Elementos Gráficos de Fundo */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_30%,rgba(201,162,39,0.12),transparent_70%)]"
          aria-hidden
        />
        <div
          className="numeral-watermark pointer-events-none absolute -bottom-10 -right-10 select-none text-[35vw] font-black leading-none text-white/[0.03]"
          aria-hidden
        >
          512
        </div>

        {/* Citação Solene */}
        <blockquote className="relative z-10 mb-12 max-w-md border-l-2 border-[var(--gold)]/50 pl-6">
          <p className="font-display text-2xl font-medium italic leading-relaxed text-white/90">
            “O JBA não pertence somente a quem está aqui hoje.”
          </p>
          <footer className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-white/50">
            — Arquivo Editorial
          </footer>
        </blockquote>
      </div>

      {/* LADO DIREITO: Formulário de Autenticação */}
      <div className="flex w-full items-center justify-center px-5 py-12 lg:w-1/2 lg:bg-[var(--paper)]">
        {/* NOVO: Envoltório em formato de Card para Mobile */}
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-sm ring-1 ring-black/[0.04] sm:px-10 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:ring-0">
          {/* Cabeçalho visível apenas em Mobile */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-[var(--gold)]/40 bg-[var(--crimson-deep)] font-display text-[17px] font-bold text-[var(--gold)] shadow-sm">
              512
            </span>
            <h1 className="mt-5 font-display text-[26px] font-semibold tracking-tight text-[var(--crimson-deep)]">
              Acesso Restrito
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-soft)]">
              Painel de gestão e memória do capítulo
            </p>
            {/* NOVO: Linha horizontal de gradiente em vez do losango/quadrado */}
            <div className="mt-7 h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold)]/70 to-transparent" />
          </div>

          {/* Cabeçalho visível apenas em Desktop */}
          <div className="mb-10 hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Administração
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--crimson)]">
              Acesso Restrito
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-soft)]">
              Entre com as suas credenciais para gerir o acervo, as lideranças e
              as admissões do capítulo.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink)]/80"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="diretoria@..."
                className="w-full rounded-[10px] border border-[var(--ink-faint)] bg-white px-4 py-3 text-[14px] text-[var(--ink)] shadow-sm transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)] focus:ring-offset-0"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink)]/80"
              >
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[var(--ink-faint)] bg-white px-4 py-3 text-[14px] text-[var(--ink)] shadow-sm transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)] focus:ring-offset-0"
              />
            </div>

            {erro && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-[10px] border border-red-200/60 bg-red-50/50 p-3 text-[13px] text-red-600"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p>{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[var(--crimson)] px-4 py-3.5 text-[14px] font-semibold text-white shadow-soft transition-all hover:bg-[var(--crimson-deep)] hover:shadow-strong disabled:opacity-70"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {carregando ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-[2.5px] border-white/30 border-t-white" />
                  Autenticando...
                </>
              ) : (
                "Acessar Painel"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
