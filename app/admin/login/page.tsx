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
    <section className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-3xl text-vermelho">Painel admin</h1>
      <p className="mt-2 text-sm text-grafite/70">
        Acesso restrito à diretoria e comissão de análise.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-grafite/20 px-3 py-2 focus:border-vermelho focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="senha" className="block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            className="mt-1 w-full rounded border border-grafite/20 px-3 py-2 focus:border-vermelho focus:outline-none"
          />
        </div>

        {erro && (
          <p role="alert" className="text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded bg-vermelho px-4 py-2 font-medium text-papel hover:bg-vermelho-claro disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
