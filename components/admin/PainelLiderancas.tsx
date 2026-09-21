"use client";

import { useEffect, useState, FormEvent } from "react";
import CampoUploadImagem from "./CampoUploadImagem";

type Mestre = {
  id: string;
  nome: string;
  fotoUrl: string | null;
  periodo: string;
  ordem: number;
};

export default function PainelLiderancas() {
  const [mestres, setMestres] = useState<Mestre[] | null>(null);
  const [removerAlvo, setRemoverAlvo] = useState<Mestre | null>(null);
  const [confirmNome, setConfirmNome] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // edição em card flutuante
  const [editarAlvo, setEditarAlvo] = useState<Mestre | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editPeriodo, setEditPeriodo] = useState("");
  const [editFotoUrl, setEditFotoUrl] = useState("");
  const [editErro, setEditErro] = useState<string | null>(null);
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  function recarregar() {
    fetch("/api/admin/liderancas")
      .then((r) => r.json())
      .then(setMestres);
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

  function parseGestao(periodo: string): number {
    const m = periodo.match(/^(\d{4})\.([12])$/);
    if (m) return Number(m[1]) * 10 + Number(m[2]);
    const y = periodo.match(/\b(19|20)\d{2}\b/);
    if (y) return Number(y[0]) * 10;
    return 0;
  }

  function abrirEdicao(m: Mestre) {
    setEditarAlvo(m);
    setEditNome(m.nome);
    setEditPeriodo(m.periodo);
    setEditFotoUrl(m.fotoUrl ?? "");
    setEditErro(null);
    setErro(null);
    setOk(null);
  }

  function fecharEdicao() {
    setEditarAlvo(null);
    setEditErro(null);
    setSalvandoEdit(false);
  }

  async function handleEditSalvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!editarAlvo) return;
    setEditErro(null);
    setErro(null);
    setOk(null);

    const nomeTrim = editNome.trim();
    const periodoTrim = editPeriodo.trim();
    const urlFoto = editFotoUrl.trim();

    if (!nomeTrim) {
      setEditErro("Nome é obrigatório.");
      return;
    }
    if (!/^\d{4}\.[12]$/.test(periodoTrim)) {
      setEditErro("Período deve ser no formato 2026.1 (ano.semestre, 1 ou 2). Ex: 2026.1 ou 2026.2");
      return;
    }
    if (urlFoto) {
      try {
        new URL(urlFoto);
      } catch {
        setEditErro("URL da foto inválida.");
        return;
      }
    }

    const payload = {
      nome: nomeTrim,
      periodo: periodoTrim,
      fotoUrl: urlFoto || null,
    };

    setSalvandoEdit(true);
    const resp = await fetch(`/api/admin/liderancas/${editarAlvo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await resp.json().catch(() => ({}));
    setSalvandoEdit(false);
    if (!resp.ok) {
      setEditErro(json.erro || "Erro ao salvar alterações.");
      return;
    }
    setOk("Mestre atualizado com sucesso!");
    fecharEdicao();
    recarregar();
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setOk(null);
    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries()) as Record<string, string>;
    const urlFoto = fotoUrl.trim() || (dados.fotoUrl as string)?.trim() || "";
    if (urlFoto) {
      try {
        new URL(urlFoto);
      } catch {
        setErro("URL da foto inválida.");
        return;
      }
    }
    const periodoTrim = (dados.periodo as string)?.trim() ?? "";
    if (!/^\d{4}\.[12]$/.test(periodoTrim)) {
      setErro("Período deve ser no formato 2026.1 (ano.semestre, 1 ou 2). Ex: 2026.1 ou 2026.2");
      return;
    }
    const payload = {
      nome: (dados.nome as string)?.trim(),
      periodo: periodoTrim,
      fotoUrl: urlFoto || null,
      ordem: String(parseGestao(periodoTrim)),
    };
    if (!payload.nome || !payload.periodo) {
      setErro("Nome e período são obrigatórios.");
      return;
    }
    const resp = await fetch("/api/admin/liderancas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      setErro(json.erro || "Erro ao salvar.");
      return;
    }
    setOk("Mestre adicionado com sucesso!");
    evento.currentTarget.reset();
    setFotoUrl("");
    recarregar();
  }

  async function confirmarRemover() {
    if (!removerAlvo) return;
    if (confirmNome.trim() !== removerAlvo.nome.trim()) return;
    await fetch(`/api/admin/liderancas/${removerAlvo.id}`, { method: "DELETE" });
    setRemoverAlvo(null);
    setConfirmNome("");
    recarregar();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-[16px] border border-[var(--ink-faint)] bg-[var(--paper)] p-5">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Novo Mestre Conselheiro</h2>
        <p className="text-xs text-[var(--ink)]/50">Histórico em reconstrução – cadastre apenas os nomes que tiver confirmação.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Nome *</label>
            <input name="nome" required className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Período * (ex: 2026.1)</label>
            <input
              name="periodo"
              required
              placeholder="2026.1"
              pattern="\d{4}\.[12]"
              title="Formato 2026.1 (ano.ponto.semestre 1 ou 2)"
              className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
            />
            <p className="mt-1 text-[11px] text-[var(--ink)]/40">Formato <strong>AAAA.S</strong>: <code className="rounded bg-[var(--gold-faint)] px-1">2026.1</code> = 1º sem, <code className="rounded bg-[var(--gold-faint)] px-1">2026.2</code> = 2º sem.</p>
          </div>
          <CampoUploadImagem
            label="Foto"
            value={fotoUrl}
            onChange={setFotoUrl}
            placeholder="https://... ou escolha arquivo"
            hint="JPG/PNG/WEBP até 4.5MB. Fallback: cole URL externa."
          />
          <input type="hidden" name="fotoUrl" value={fotoUrl} />
          {/* Ordem calculada automaticamente de 2026.1; mantém input hidden para API */}
          <input type="hidden" name="ordem" value="" />
          {erro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}
          {ok && <p className="rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{ok}</p>}
          <button type="submit" className="w-full rounded-full bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--crimson-deep)]">
            Adicionar
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Mestres cadastrados ({mestres?.length ?? 0})</h2>
        <p className="text-xs text-[var(--ink)]/40">Clique em Editar para alterar em card flutuante.</p>
        {ok && <p className="mt-2 rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{ok}</p>}
        <ul className="mt-4 space-y-2">
          {mestres?.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2 rounded-[12px] border border-[var(--ink-faint)] bg-white px-4 py-3 text-sm shadow-sm">
              <span>
                <strong className="text-[var(--ink)]">{m.nome}</strong> <span className="text-[var(--ink)]/50">— {m.periodo}</span>
              </span>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => abrirEdicao(m)}
                  className="rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)]"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setRemoverAlvo(m);
                    setConfirmNome("");
                  }}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
          {mestres?.length === 0 && (
            <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
              Nenhum Mestre cadastrado. Histórico incompleto – adicione os nomes confirmados.
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
            <div className="border-b border-[var(--ink-faint)] bg-[var(--paper)] px-6 py-4 pr-12">
              <h3 className="font-display text-base font-semibold text-[var(--crimson)]">Editar Mestre Conselheiro</h3>
              <p className="mt-1 text-xs text-[var(--ink)]/50">
                Editando <span className="font-semibold text-[var(--ink)]">{editarAlvo.nome}</span> — {editarAlvo.periodo}
              </p>
            </div>
            <form onSubmit={handleEditSalvar} className="space-y-3 px-6 py-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Nome *</label>
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Período * (ex: 2026.1)</label>
                <input
                  value={editPeriodo}
                  onChange={(e) => setEditPeriodo(e.target.value)}
                  required
                  placeholder="2026.1"
                  pattern="\d{4}\.[12]"
                  title="Formato 2026.1 (ano.ponto.semestre 1 ou 2)"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
                <p className="mt-1 text-[11px] text-[var(--ink)]/40">
                  Formato <strong>AAAA.S</strong>: ordem recalculada automaticamente.
                </p>
              </div>
              <CampoUploadImagem
                label="Foto"
                value={editFotoUrl}
                onChange={setEditFotoUrl}
                placeholder="https://... ou escolha arquivo"
                hint="JPG/PNG/WEBP até 4.5MB. Fallback: cole URL externa."
              />
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

      {removerAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[18px] border bg-white p-6 shadow-strong">
            <h3 className="font-display font-semibold text-[var(--crimson)]">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Digite exatamente <span className="font-semibold text-[var(--ink)]">{removerAlvo.nome}</span> para remover.
            </p>
            <input
              value={confirmNome}
              onChange={(e) => setConfirmNome(e.target.value)}
              placeholder={removerAlvo.nome}
              className="mt-4 w-full rounded-[12px] border border-[var(--ink-faint)] px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
              autoFocus
            />
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setRemoverAlvo(null)} className="rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)]">
                Cancelar
              </button>
              <button
                onClick={confirmarRemover}
                disabled={confirmNome.trim() !== removerAlvo.nome.trim()}
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
