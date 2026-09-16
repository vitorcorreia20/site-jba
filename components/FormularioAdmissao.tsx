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
      setMensagemErro(erro instanceof Error ? erro.message : "Erro inesperado.");
    }
  }

  if (status === "sucesso") {
    return (
      <div
        role="status"
        className="rounded-[16px] border border-[var(--gold)]/25 bg-[var(--gold-faint)] p-6"
      >
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-sm font-bold text-[var(--crimson-deep)]">
            ✓
          </span>
          <div>
            <p className="font-display text-[17px] font-semibold text-[var(--crimson)]">
              Solicitação enviada.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">
              A comissão de análise do capítulo vai avaliar seu pedido e entrar em contato pelo WhatsApp informado em
              até 48h.
            </p>
            <button
              type="button"
              onClick={() => setStatus("ocioso")}
              className="mt-3 text-xs font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4"
            >
              Enviar outra solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo label="Nome completo" name="nomeCompleto" autoComplete="name" required />
        </div>
        <Campo label="Data de nascimento" name="dataNascimento" type="date" autoComplete="bday" required />
        <Campo label="Cidade" name="cidade" autoComplete="address-level2" required />
        <Campo
          label="WhatsApp (com DDD)"
          name="telefone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="(11) 9 9999-9999"
          required
        />
        <div className="sm:col-span-2">
          <Campo
            label="Nome do responsável (se menor de idade)"
            name="responsavel"
            autoComplete="name"
            hint="Opcional — informe se você tem menos de 18 anos."
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-[12px] font-semibold uppercase tracking-wide text-[var(--ink)]">
          Por que você quer fazer parte do capítulo?
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          placeholder="Conte em poucas linhas sua motivação..."
          maxLength={500}
          className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-3 text-sm placeholder:text-[var(--ink)]/35 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
        />
        <p className="mt-1 text-right text-[11px] text-[var(--ink)]/35">Máx. 500 caracteres</p>
      </div>

      {status === "erro" && mensagemErro && (
        <p role="alert" className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {mensagemErro}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--crimson)] px-7 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-[var(--crimson-deep)] hover:-translate-y-px hover:shadow-strong disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "enviando" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Enviando...
          </>
        ) : (
          <>Enviar solicitação →</>
        )}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[12px] font-semibold uppercase tracking-wide text-[var(--ink)]">
        {label}
        {required && <span className="ml-1 font-bold text-[var(--crimson)]">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-[var(--ink)]/40">{hint}</p>}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-required={required}
        className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
      />
    </div>
  );
}
