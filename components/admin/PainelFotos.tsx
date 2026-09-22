"use client";

import { useEffect, useState, FormEvent } from "react";
import CampoUploadImagem from "./CampoUploadImagem";

type Foto = {
  id: string;
  url: string;
  legenda: string | null;
  ordem: number;
};

export default function PainelFotos({ papel }: { papel?: "DIRETORIA" | "COMISSAO" } = {}) {
  const isDiretoria = papel === "DIRETORIA";
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // edição
  const [editarAlvo, setEditarAlvo] = useState<Foto | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editLegenda, setEditLegenda] = useState("");
  const [editOrdem, setEditOrdem] = useState("");
  const [editErro, setEditErro] = useState<string | null>(null);
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  function recarregar() {
    fetch("/api/admin/fotos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFotos(data);
        else {
          setFotos([]);
          if (data?.erro) setErro(data.erro);
        }
      })
      .catch(() => setFotos([]));
  }

  useEffect(recarregar, []);

  useEffect(() => {
    if (!editarAlvo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharEdicao();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editarAlvo]);

  function abrirEdicao(f: Foto) {
    setEditarAlvo(f);
    setEditUrl(f.url);
    setEditLegenda(f.legenda ?? "");
    setEditOrdem(String(f.ordem ?? 0));
    setEditErro(null);
    setErro(null);
    setOk(null);
  }

  function fecharEdicao() {
    setEditarAlvo(null);
    setEditErro(null);
    setSalvandoEdit(false);
  }

  async function handleEditSalvar(e: FormEvent) {
    e.preventDefault();
    if (!editarAlvo) return;
    setEditErro(null);
    const url = editUrl.trim();
    if (!url) {
      setEditErro("URL da imagem é obrigatória.");
      return;
    }
    try {
      new URL(url);
    } catch {
      setEditErro("URL da imagem inválida.");
      return;
    }
    setSalvandoEdit(true);
    const resp = await fetch(`/api/admin/fotos/${editarAlvo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, legenda: editLegenda.trim() || null, ordem: editOrdem }),
    });
    const json = await resp.json().catch(() => ({}));
    setSalvandoEdit(false);
    if (!resp.ok) {
      setEditErro(json.erro || "Erro ao salvar alterações.");
      return;
    }
    setOk("Foto atualizada com sucesso!");
    fecharEdicao();
    recarregar();
  }

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
    if (!isDiretoria) return;
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
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
      <div className="rounded-[16px] border border-[var(--ink-faint)] bg-[var(--paper)] p-4 sm:p-5">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Nova foto de ação</h2>
        <p className="text-xs leading-relaxed text-[var(--ink)]/50">
          Escolha um arquivo (JPG/PNG/WEBP, máx 4.5MB) ou cole uma URL externa.
          {!isDiretoria && (
            <span className="mt-1 block rounded-full bg-[var(--gold-faint)] px-2 py-1 text-[11px] font-medium text-[var(--crimson)]">
              Gestor: você pode adicionar e editar, mas apenas Administração exclui.
            </span>
          )}
        </p>
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

      <div className="min-w-0">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Fotos cadastradas ({fotos?.length ?? 0})</h2>
        {erro && <p className="mt-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}
        {ok && <p className="mt-2 rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{ok}</p>}
        <ul className="mt-4 space-y-2">
          {fotos?.map((f) => (
            <li key={f.id} className="flex flex-col gap-2 rounded-[12px] border border-[var(--ink-faint)] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:px-3 sm:py-2">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-[var(--ink-faint)] bg-[var(--paper-2)]">
                  <img src={f.url} alt={f.legenda ?? ""} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--ink)] sm:break-all">{f.legenda || f.url}</p>
                  <p className="text-[11px] text-[var(--ink)]/40">Ordem: {f.ordem}</p>
                </div>
              </div>
              <div className="flex w-full gap-1.5 sm:w-auto sm:shrink-0">
                <button
                  onClick={() => abrirEdicao(f)}
                  className="flex-1 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)] sm:flex-none"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemover(f)}
                  disabled={!isDiretoria}
                  title={isDiretoria ? "Remover foto" : "Apenas Administração pode excluir"}
                  className="flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold sm:flex-none disabled:cursor-not-allowed disabled:opacity-40 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:hover:bg-red-50"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
          {fotos?.length === 0 && (
            <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
              Nenhuma foto cadastrada.
            </li>
          )}
        </ul>
      </div>

      {editarAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-strong">
            <button
              type="button"
              onClick={fecharEdicao}
              aria-label="Fechar"
              className="absolute right-4 top-4 rounded-full border border-[var(--ink-faint)] bg-white p-2 text-[var(--ink)]/60 hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <div className="border-b border-[var(--ink-faint)] bg-[var(--paper)] px-4 py-4 pr-12 sm:px-6">
              <h3 className="font-display text-base font-semibold text-[var(--crimson)]">Editar foto</h3>
              <p className="mt-1 text-xs text-[var(--ink)]/50">Altere legenda, ordem ou substitua a imagem.</p>
            </div>
            <form onSubmit={handleEditSalvar} className="space-y-3 px-4 py-4 sm:px-6">
              <CampoUploadImagem
                label="Imagem *"
                value={editUrl}
                onChange={setEditUrl}
                placeholder="https://... ou escolha arquivo"
                required
                hint="Deixe a URL atual ou faça novo upload."
              />
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Legenda</label>
                <input
                  value={editLegenda}
                  onChange={(e) => setEditLegenda(e.target.value)}
                  placeholder="Ex: Ação social - 2024"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Ordem</label>
                <input
                  value={editOrdem}
                  onChange={(e) => setEditOrdem(e.target.value)}
                  type="number"
                  placeholder="0"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              {editErro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{editErro}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={fecharEdicao}
                  className="rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoEdit}
                  className="rounded-full bg-[var(--crimson)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--crimson-deep)] disabled:opacity-40"
                >
                  {salvandoEdit ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
