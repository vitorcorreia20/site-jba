"use client";

import { useState, FormEvent } from "react";

type Status = "ocioso" | "enviando" | "sucesso" | "erro";

export default function FormularioAdmissao() {
  const [status, setStatus] = useState<Status>("ocioso");
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setStatus("enviando");
    setMensagemErro(null);

    const form = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(form).entries());

    try {
      const resposta = await fetch("/api/admissoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        throw new Error(corpo?.erro ?? "Não foi possível enviar o formulário.");
      }

      setStatus("sucesso");
      form.reset();
    } catch (erro) {
      setStatus("erro");
      setMensagemErro(
        erro instanceof Error ? erro.message : "Erro inesperado."
      );
    }
  }

  if (status === "sucesso") {
    return (
      <div
        role="status"
        className="rounded border border-dourado/40 bg-dourado/10 p-6"
      >
        <p className="font-display text-xl text-azul">
          Solicitação enviada.
        </p>
        <p className="mt-2 text-grafite/80">
          A comissão de análise do capítulo vai avaliar seu pedido e entrar
          em contato pelo e-mail ou telefone informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-prose">
      <Campo label="Nome completo" name="nomeCompleto" required />
      <Campo
        label="Data de nascimento"
        name="dataNascimento"
        type="date"
        required
      />
      <Campo label="E-mail" name="email" type="email" required />
      <Campo label="Telefone (com DDD)" name="telefone" type="tel" required />
      <Campo
        label="Nome do responsável (se menor de idade)"
        name="responsavel"
      />
      <Campo label="Cidade" name="cidade" required />

      <div>
        <label
          htmlFor="mensagem"
          className="block text-sm font-medium text-grafite"
        >
          Por que você quer fazer parte do capítulo?
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          className="mt-1 w-full rounded border border-grafite/20 px-3 py-2 focus:border-azul focus:outline-none"
        />
      </div>

      {status === "erro" && mensagemErro && (
        <p role="alert" className="text-sm text-red-700">
          {mensagemErro}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="rounded bg-azul px-6 py-3 font-medium text-papel transition-colors hover:bg-azul-claro disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando..." : "Enviar solicitação"}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-grafite">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded border border-grafite/20 px-3 py-2 focus:border-azul focus:outline-none"
      />
    </div>
  );
}
