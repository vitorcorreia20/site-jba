"use client";

import { signOut } from "next-auth/react";

export default function BotaoSair() {
  async function sair() {
    // redirect:false para o next-auth não barrar o destino (outra origem);
    // a navegação manual garante o domínio canônico.
    await signOut({ redirect: false });
    window.location.href = "https://capitulo512.vcdev.com.br";
  }

  return (
    <button
      onClick={sair}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] shadow-sm transition-colors hover:bg-[var(--paper-2)]"
      aria-label="Sair da conta"
    >
      Sair <span aria-hidden>→</span>
    </button>
  );
}
