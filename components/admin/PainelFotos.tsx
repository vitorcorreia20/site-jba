"use client";

import { useEffect, useState, FormEvent } from "react";

type Foto = {
  id: string;
  url: string;
  legenda: string | null;
  ordem: number;
};

export default function PainelFotos() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [removerAlvo, setRemoverAlvo] = useState<Foto | null>(null);
  const [confirmTexto, setConfirmTexto] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  function recarregar() {
    fetch("/api/admin/fotos")
      .then((r) => r.json())
      .then(setFotos);
  }

  useEffect(recarregar, []);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries());
    await fetch("/api/admin/fotos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    evento.currentTarget.reset();
    setPreviewUrl("");
    recarregar();
  }

  async function confirmarRemover() {
    if (!removerAlvo) return;
    if (confirmTexto.trim() !== (removerAlvo.legenda ?? removerAlvo.url).trim().slice(0, 20)) return;
    await fetch(`/api/admin/fotos/${removerAlvo.id}`, { method: "DELETE" });
    setRemoverAlvo(null);
    setConfirmTexto("");
    recarregar();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-[16px] border border-[var(--ink-faint)] bg-[var(--paper)] p-5">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Nova foto de ação</h2>
        <p className="text-xs text-[var(--ink)]/50">Envie ao Vercel Blob e cole a URL pública.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">URL da imagem *</label>
            <input
              name="url"
              required
              placeholder="https://..."
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
            />
          </div>
          {previewUrl && (
            <div className="overflow-hidden rounded-[12px] border border-[var(--ink-faint)] bg-[var(--paper-2)]">
              <div className="relative aspect-[4/3] w-full">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
              </div>
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Legenda</label>
            <input name="legenda" placeholder="Ex: Ação social - 2024" className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Ordem</label>
            <input name="ordem" type="number" placeholder="0" className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]" />
          </div>
          <button type="submit" className="w-full rounded-full bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--crimson-deep)]">
            Adicionar foto
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Fotos cadastradas ({fotos?.length ?? 0})</h2>
        <ul className="mt-4 space-y-2">
          {fotos?.map((f) => (
            <li key={f.id} className="flex items-center gap-3 rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2 shadow-sm">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-[var(--ink-faint)] bg-[var(--paper-2)]">
                <img src={f.url} alt={f.legenda ?? ""} className="h-full w-full object-cover" />
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink)]">{f.legenda || f.url}</span>
              <button
                onClick={() => {
                  setRemoverAlvo(f);
                  setConfirmTexto("");
                }}
                className="shrink-0 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Remover
              </button>
            </li>
          ))}
          {fotos?.length === 0 && (
            <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
              Nenhuma foto cadastrada.
            </li>
          )}
        </ul>
      </div>

      {removerAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[18px] border bg-white p-6 shadow-strong">
            <h3 className="font-display font-semibold text-[var(--crimson)]">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Digite os primeiros 20 caracteres de <span className="font-semibold">{(removerAlvo.legenda ?? removerAlvo.url).slice(0, 20)}</span> para
              remover.
            </p>
            <input
              value={confirmTexto}
              onChange={(e) => setConfirmTexto(e.target.value)}
              placeholder={(removerAlvo.legenda ?? removerAlvo.url).slice(0, 20)}
              className="mt-4 w-full rounded-[12px] border border-[var(--ink-faint)] px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
              autoFocus
            />
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setRemoverAlvo(null)} className="rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)]">
                Cancelar
              </button>
              <button
                onClick={confirmarRemover}
                disabled={confirmTexto.trim() !== (removerAlvo.legenda ?? removerAlvo.url).trim().slice(0, 20)}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
