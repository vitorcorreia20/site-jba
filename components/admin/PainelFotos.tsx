"use client";

import { useEffect, useState, FormEvent } from "react";
import CampoUploadImagem from "./CampoUploadImagem";

type Foto = {
  id: string;
  url: string;
  legenda: string | null;
  ordem: number;
};

export default function PainelFotos() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function recarregar() {
    fetch("/api/admin/fotos")
      .then((r) => r.json())
      .then(setFotos);
  }

  useEffect(recarregar, []);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setOk(null);
    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries()) as Record<string, string>;
    const url = previewUrl.trim() || (dados.url as string)?.trim();
    if (!url) {
      setErro("Selecione um arquivo ou cole a URL da imagem.");
      return;
    }
    try {
      new URL(url);
    } catch {
      setErro("URL da imagem inválida.");
      return;
    }
    const resp = await fetch("/api/admin/fotos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, legenda: dados.legenda, ordem: dados.ordem }),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      setErro(json.erro || "Erro ao salvar foto.");
      return;
    }
    setOk("Foto adicionada com sucesso!");
    evento.currentTarget.reset();
    setPreviewUrl("");
    recarregar();
  }

  async function handleRemover(foto: Foto) {
    if (!window.confirm("Remover esta foto?")) return;
    setErro(null);
    const resp = await fetch(`/api/admin/fotos/${foto.id}`, { method: "DELETE" });
    if (!resp.ok) {
      const json = await resp.json().catch(() => ({}));
      setErro(json.erro || "Erro ao remover foto.");
      return;
    }
    recarregar();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-[16px] border border-[var(--ink-faint)] bg-[var(--paper)] p-5">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Nova foto de ação</h2>
        <p className="text-xs text-[var(--ink)]/50">Escolha um arquivo (JPG/PNG/WEBP, máx 4.5MB) ou cole uma URL externa.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <CampoUploadImagem
            label="Imagem *"
            value={previewUrl}
            onChange={setPreviewUrl}
            placeholder="https://... ou escolha um arquivo"
            required
            hint="Upload direto para Vercel Blob. Fallback: cole link do Cloudinary/externo."
          />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Legenda</label>
            <input name="legenda" placeholder="Ex: Ação social - 2024" className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Ordem</label>
            <input name="ordem" type="number" placeholder="0" className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]" />
          </div>
          {erro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}
          {ok && <p className="rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{ok}</p>}
          <button type="submit" className="w-full rounded-full bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--crimson-deep)]">
            Adicionar foto
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Fotos cadastradas ({fotos?.length ?? 0})</h2>
        {erro && <p className="mt-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}
        <ul className="mt-4 space-y-2">
          {fotos?.map((f) => (
            <li key={f.id} className="flex items-center gap-3 rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2 shadow-sm">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-[var(--ink-faint)] bg-[var(--paper-2)]">
                <img src={f.url} alt={f.legenda ?? ""} className="h-full w-full object-cover" />
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink)]">{f.legenda || f.url}</span>
              <button
                onClick={() => handleRemover(f)}
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
    </div>
  );
}
