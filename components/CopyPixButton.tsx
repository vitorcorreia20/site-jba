"use client";

import { useState } from "react";

export default function CopyPixButton({ pix }: { pix: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pix);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("input");
      el.value = pix;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }

  return (
    <button
      onClick={copiar}
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--crimson)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--crimson-deep)]"
      aria-live="polite"
    >
      {copiado ? "✓ Copiado!" : "Copiar chave"}
    </button>
  );
}
