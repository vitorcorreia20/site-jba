"use client";

import { signOut } from "next-auth/react";

export default function BotaoSair() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded border border-grafite/20 px-4 py-2 text-sm hover:bg-grafite/5"
    >
      Sair
    </button>
  );
}
