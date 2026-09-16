"use client";

import { signOut } from "next-auth/react";

export default function BotaoSair() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] shadow-sm transition-colors hover:bg-[var(--paper-2)]"
      aria-label="Sair da conta"
    >
      Sair <span aria-hidden>→</span>
    </button>
  );
}
