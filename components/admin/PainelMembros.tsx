"use client";

import { useEffect, useState, FormEvent } from "react";
import CampoUploadImagem from "./CampoUploadImagem";

type Premio = {
  id: string;
  imagemUrl: string;
  legenda: string | null;
  ordem: number;
};

type Membro = {
  id: string;
  idDemolay: string;
  nome: string;
  fotoUrl: string | null;
  tipo: "ATIVO" | "DIRETORIA";
  cargoAtual: string | null;
  historicoCargos: string | null;
  premios: Premio[];
};

type PremioDraft = { imagemUrl: string; legenda: string };

export default function PainelMembros() {
  const [membros, setMembros] = useState<Membro[] | null>(null);
  const [premiosDraft, setPremiosDraft] = useState<PremioDraft[]>([]);
  const [fotoUrl, setFotoUrl] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [removerAlvo, setRemoverAlvo] = useState<Membro | null>(null);
  const [confirmNome, setConfirmNome] = useState("");

  // --- edição em card flutuante ---
  const [editarAlvo, setEditarAlvo] = useState<Membro | null>(null);
  const [editIdDemolay, setEditIdDemolay] = useState("");
  const [editNome, setEditNome] = useState("");
  const [editTipo, setEditTipo] = useState<"ATIVO" | "DIRETORIA">("ATIVO");
  const [editFotoUrl, setEditFotoUrl] = useState("");
  const [editCargoAtual, setEditCargoAtual] = useState("");
  const [editHistorico, setEditHistorico] = useState("");
  const [editPremios, setEditPremios] = useState<PremioDraft[]>([]);
  const [editErro, setEditErro] = useState<string | null>(null);
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  function recarregar() {
    fetch("/api/admin/membros")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembros(
            [...data].sort((a: Membro, b: Membro) =>
              a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
            )
          );
        } else setMembros([]);
      });
  }

  useEffect(recarregar, []);

  // fechamento via Esc — só para edição, remoção mantém só por botão
  useEffect(() => {
    if (!editarAlvo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharEdicao();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editarAlvo]);

  function addPremio() {
    setPremiosDraft((prev) => [...prev, { imagemUrl: "", legenda: "" }]);
  }
  function updatePremio(idx: number, campo: keyof PremioDraft, valor: string) {
    setPremiosDraft((prev) => prev.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p)));
  }
  function removePremio(idx: number) {
    setPremiosDraft((prev) => prev.filter((_, i) => i !== idx));
  }

  // edição - prêmios
  function addPremioEdit() {
    setEditPremios((prev) => [...prev, { imagemUrl: "", legenda: "" }]);
  }
  function updatePremioEdit(idx: number, campo: keyof PremioDraft, valor: string) {
    setEditPremios((prev) => prev.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p)));
  }
  function removePremioEdit(idx: number) {
    setEditPremios((prev) => prev.filter((_, i) => i !== idx));
  }

  function abrirEdicao(m: Membro) {
    setEditarAlvo(m);
    setEditIdDemolay(m.idDemolay);
    setEditNome(m.nome);
    setEditTipo(m.tipo);
    setEditFotoUrl(m.fotoUrl ?? "");
    setEditCargoAtual(m.cargoAtual ?? "");
    setEditHistorico(m.historicoCargos ?? "");
    setEditPremios(m.premios.map((p) => ({ imagemUrl: p.imagemUrl, legenda: p.legenda ?? "" })));
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

    const idDemolay = editIdDemolay.trim();
    if (idDemolay.length < 5 || idDemolay.length > 9) {
      setEditErro("ID DeMolay deve ter entre 5 e 9 caracteres.");
      return;
    }
    if (!/^\d+$/.test(idDemolay)) {
      setEditErro("ID DeMolay deve conter apenas números.");
      return;
    }
    if (!editNome.trim()) {
      setEditErro("Nome é obrigatório.");
      return;
    }
    const urlFoto = editFotoUrl.trim();
    if (urlFoto) {
      try {
        new URL(urlFoto);
      } catch {
        setEditErro("URL da foto inválida.");
        return;
      }
    }

    const premios = editPremios
      .map((p) => ({ imagemUrl: p.imagemUrl.trim(), legenda: p.legenda.trim() || null }))
      .filter((p) => p.imagemUrl.length > 0)
      .map((p, idx) => ({ imagemUrl: p.imagemUrl, legenda: p.legenda, ordem: idx }));

    for (const p of premios) {
      try {
        new URL(p.imagemUrl);
      } catch {
        setEditErro(`URL de prêmio inválida: ${p.imagemUrl}`);
        return;
      }
    }

    const payload = {
      idDemolay,
      nome: editNome.trim(),
      tipo: editTipo,
      fotoUrl: urlFoto || null,
      cargoAtual: editCargoAtual.trim() || null,
      historicoCargos: editHistorico.trim() || null,
      premios,
    };

    setSalvandoEdit(true);
    const resp = await fetch(`/api/admin/membros/${editarAlvo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await resp.json().catch(() => ({}));
    setSalvandoEdit(false);
    if (!resp.ok) {
      setEditErro(json.erro || (json.detalhes ? JSON.stringify(json.detalhes) : "Erro ao salvar alterações"));
      return;
    }

    setOk(`Membro #${idDemolay} atualizado com sucesso!`);
    fecharEdicao();
    recarregar();
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setOk(null);
    const form = evento.currentTarget;
    const dadosForm = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const idDemolay = (dadosForm.idDemolay || "").trim();
    if (idDemolay.length < 5 || idDemolay.length > 9) {
      setErro("ID DeMolay deve ter entre 5 e 9 caracteres.");
      return;
    }
    if (!/^\d+$/.test(idDemolay)) {
      setErro("ID DeMolay deve conter apenas números.");
      return;
    }

    const premios = premiosDraft
      .map((p) => ({ imagemUrl: p.imagemUrl.trim(), legenda: p.legenda.trim() || null }))
      .filter((p) => p.imagemUrl.length > 0)
      .map((p, idx) => ({ imagemUrl: p.imagemUrl, legenda: p.legenda, ordem: idx }));

    for (const p of premios) {
      try {
        new URL(p.imagemUrl);
      } catch {
        setErro(`URL de prêmio inválida: ${p.imagemUrl}`);
        return;
      }
    }

    const urlFoto = fotoUrl.trim() || (dadosForm.fotoUrl as string)?.trim() || "";
    if (urlFoto) {
      try {
        new URL(urlFoto);
      } catch {
        setErro("URL da foto inválida.");
        return;
      }
    }

    const payload = {
      idDemolay,
      nome: dadosForm.nome?.trim(),
      tipo: dadosForm.tipo,
      fotoUrl: urlFoto || null,
      cargoAtual: dadosForm.cargoAtual?.trim() || null,
      historicoCargos: dadosForm.historicoCargos?.trim() || null,
      premios,
    };

    const resp = await fetch("/api/admin/membros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    if (!resp.ok) {
      setErro(json.erro || (json.detalhes ? JSON.stringify(json.detalhes) : "Erro ao criar membro"));
      return;
    }

    setOk(`Membro #${idDemolay} criado com sucesso!`);
    form.reset();
    setFotoUrl("");
    setPremiosDraft([]);
    recarregar();
  }

  async function confirmarRemover() {
    if (!removerAlvo) return;
    if (confirmNome.trim() !== removerAlvo.nome.trim()) {
      setErro(`Digite exatamente "${removerAlvo.nome}" para confirmar.`);
      return;
    }
    await fetch(`/api/admin/membros/${removerAlvo.id}`, { method: "DELETE" });
    setRemoverAlvo(null);
    setConfirmNome("");
    setErro(null);
    recarregar();
  }

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
      <div className="rounded-[16px] border border-[var(--ink-faint)] bg-[var(--paper)] p-4 sm:p-5">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Novo membro</h2>
        <p className="text-xs leading-relaxed text-[var(--ink)]/50">
          ID DeMolay 5–9 dígitos. Ordenação automática por ID. Use a confirmação por nome ao remover.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <CampoTexto label="ID DeMolay *" name="idDemolay" required placeholder="114329" type="text" />
          <CampoTexto label="Nome *" name="nome" required placeholder="Vitor dos Santos Correia" />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">
              Tipo de quadro
            </label>
            <select name="tipo" className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]">
              <option value="ATIVO">Quadro de ativos</option>
              <option value="DIRETORIA">Diretoria (aparece com card)</option>
            </select>
          </div>
          <CampoUploadImagem
            label="Foto do membro"
            value={fotoUrl}
            onChange={setFotoUrl}
            placeholder="https://... ou escolha arquivo"
            hint="JPG/PNG/WEBP até 4.5MB. Fallback: cole URL externa."
          />
          {/* fallback hidden input para compatibilidade com FormData caso use URL manual extra */}
          <input type="hidden" name="fotoUrl" value={fotoUrl} />
          <CampoTexto label="Cargo atual" name="cargoAtual" placeholder="Mestre Conselheiro" />
          <CampoTextarea label="Histórico de cargos (um por linha)" name="historicoCargos" placeholder={"2024.1 - Hospitaleiro\n2025 - Tesoureiro"} />

          <div className="rounded-[12px] border border-[var(--ink-faint)] bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                Prêmios e honrarias — cada um é uma imagem
              </span>
              <button
                type="button"
                onClick={addPremio}
                className="rounded-full bg-[var(--crimson)] px-3 py-1 text-xs font-semibold text-white hover:bg-[var(--crimson-deep)]"
              >
                + Adicionar prêmio
              </button>
            </div>
            {premiosDraft.length === 0 && (
              <p className="mt-2 text-xs text-[var(--ink)]/40">Nenhum prêmio adicionado. Clique em “Adicionar prêmio”.</p>
            )}
            <div className="mt-3 space-y-3">
              {premiosDraft.map((p, idx) => (
                <div key={idx} className="rounded-[12px] border border-[var(--ink-faint)] bg-[var(--paper)] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--ink)]/60">Prêmio #{idx + 1}</span>
                    <button type="button" onClick={() => removePremio(idx)} className="text-xs font-medium text-red-700 hover:underline">
                      Remover
                    </button>
                  </div>
                  <CampoUploadImagem
                    label={`Imagem do prêmio #${idx + 1}`}
                    value={p.imagemUrl}
                    onChange={(v) => updatePremio(idx, "imagemUrl", v)}
                    placeholder="https://... ou escolha arquivo"
                    hint="Upload sequencial (um por vez) até 4.5MB cada."
                  />
                  <input
                    type="text"
                    placeholder="Legenda (opcional) ex: Chevalier - 2024"
                    value={p.legenda}
                    onChange={(e) => updatePremio(idx, "legenda", e.target.value)}
                    className="mt-2 w-full rounded-[10px] border border-[var(--ink-faint)] bg-white px-3 py-2 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {erro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
          {ok && <p className="rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</p>}

          <button type="submit" className="w-full rounded-full bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-[var(--crimson-deep)]">
            Adicionar membro
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">
          Membros cadastrados ({membros?.length ?? 0})
        </h2>
        <p className="text-xs text-[var(--ink)]/40">Ordem crescente por ID. Clique em Editar para alterar em card flutuante.</p>
        {ok && <p className="mt-2 rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</p>}
        <ul className="mt-4 space-y-2">
          {membros?.map((m) => (
            <li key={m.id} className="rounded-[12px] border border-[var(--ink-faint)] bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <span className="min-w-0 break-words font-medium text-[var(--ink)]">
                  <span className="mr-2 inline-block rounded-full bg-[var(--crimson)] px-2 py-0.5 text-xs font-bold text-white">
                    #{m.idDemolay}
                  </span>
                  {m.nome}
                </span>
                <div className="flex gap-1.5 sm:shrink-0">
                  <button
                    onClick={() => abrirEdicao(m)}
                    className="flex-1 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)] sm:flex-none sm:py-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setRemoverAlvo(m);
                      setConfirmNome("");
                      setErro(null);
                    }}
                    className="flex-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 sm:flex-none sm:py-1"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <span className="text-xs text-[var(--ink)]/50">
                {m.tipo === "ATIVO" ? "Ativo" : "Diretoria"}
                {m.cargoAtual ? ` · ${m.cargoAtual}` : ""}
                {m.premios?.length ? ` · ${m.premios.length} prêmio(s)` : ""}
              </span>
              {m.premios && m.premios.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.premios.slice(0, 4).map((pr) => (
                    <img
                      key={pr.id}
                      src={pr.imagemUrl}
                      alt={pr.legenda ?? ""}
                      title={pr.legenda ?? ""}
                      className="h-10 w-10 rounded-[8px] border border-[var(--ink-faint)] object-cover"
                    />
                  ))}
                  {m.premios.length > 4 && (
                    <span className="self-center text-xs text-[var(--ink)]/40">+{m.premios.length - 4}</span>
                  )}
                </div>
              )}
            </li>
          ))}
          {membros?.length === 0 && (
            <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
              Nenhum membro cadastrado ainda.
            </li>
          )}
        </ul>
      </div>

      {editarAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-strong">
            <button
              type="button"
              onClick={fecharEdicao}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 rounded-full border border-[var(--ink-faint)] bg-white p-2 text-[var(--ink)]/60 hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <div className="border-b border-[var(--ink-faint)] bg-[var(--paper)] px-4 py-4 pr-12 sm:px-6">
              <h3 className="font-display text-base font-semibold text-[var(--crimson)]">Editar membro</h3>
              <p className="mt-1 break-words text-xs text-[var(--ink)]/50">
                Editando <span className="font-semibold text-[var(--ink)]">{editarAlvo.nome}</span>{" "}
                <span className="rounded-full bg-[var(--crimson)] px-2 py-0.5 text-xs font-bold text-white">#{editarAlvo.idDemolay}</span>
              </p>
            </div>
            <form onSubmit={handleEditSalvar} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">ID DeMolay *</label>
                <input
                  value={editIdDemolay}
                  onChange={(e) => setEditIdDemolay(e.target.value)}
                  required
                  placeholder="114329"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Nome *</label>
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  required
                  placeholder="Nome completo"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Tipo de quadro</label>
                <select
                  value={editTipo}
                  onChange={(e) => setEditTipo(e.target.value as "ATIVO" | "DIRETORIA")}
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                >
                  <option value="ATIVO">Quadro de ativos</option>
                  <option value="DIRETORIA">Diretoria (aparece com card)</option>
                </select>
              </div>
              <CampoUploadImagem
                label="Foto do membro"
                value={editFotoUrl}
                onChange={setEditFotoUrl}
                placeholder="https://... ou escolha arquivo"
                hint="JPG/PNG/WEBP até 4.5MB. Fallback: cole URL externa."
              />
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Cargo atual</label>
                <input
                  value={editCargoAtual}
                  onChange={(e) => setEditCargoAtual(e.target.value)}
                  placeholder="Mestre Conselheiro"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Histórico de cargos (um por linha)</label>
                <textarea
                  value={editHistorico}
                  onChange={(e) => setEditHistorico(e.target.value)}
                  rows={3}
                  placeholder={"2024.1 - Hospitaleiro\n2025 - Tesoureiro"}
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>

              <div className="rounded-[12px] border border-[var(--ink-faint)] bg-[var(--paper)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Prêmios e honrarias</span>
                  <button
                    type="button"
                    onClick={addPremioEdit}
                    className="rounded-full bg-[var(--crimson)] px-3 py-1 text-xs font-semibold text-white hover:bg-[var(--crimson-deep)]"
                  >
                    + Adicionar prêmio
                  </button>
                </div>
                {editPremios.length === 0 && (
                  <p className="mt-2 text-xs text-[var(--ink)]/40">Nenhum prêmio. Clique em “Adicionar prêmio”.</p>
                )}
                <div className="mt-3 space-y-3">
                  {editPremios.map((p, idx) => (
                    <div key={idx} className="rounded-[12px] border border-[var(--ink-faint)] bg-white p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--ink)]/60">Prêmio #{idx + 1}</span>
                        <button type="button" onClick={() => removePremioEdit(idx)} className="text-xs font-medium text-red-700 hover:underline">
                          Remover
                        </button>
                      </div>
                      <CampoUploadImagem
                        label={`Imagem do prêmio #${idx + 1}`}
                        value={p.imagemUrl}
                        onChange={(v) => updatePremioEdit(idx, "imagemUrl", v)}
                        placeholder="https://... ou escolha arquivo"
                        hint="Upload sequencial (um por vez) até 4.5MB cada."
                      />
                      <input
                        type="text"
                        placeholder="Legenda (opcional) ex: Chevalier - 2024"
                        value={p.legenda}
                        onChange={(e) => updatePremioEdit(idx, "legenda", e.target.value)}
                        className="mt-2 w-full rounded-[10px] border border-[var(--ink-faint)] bg-white px-3 py-2 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {editErro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{editErro}</p>}

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
          <div className="w-full max-w-sm rounded-[18px] border border-[var(--ink-faint)] bg-white p-4 shadow-strong sm:p-6">
            <h3 className="font-display text-base font-semibold text-[var(--crimson)]">Confirmar exclusão</h3>
            <p className="mt-2 break-words text-sm leading-relaxed text-[var(--ink-soft)]">
              Digite exatamente <span className="font-semibold text-[var(--ink)]">{removerAlvo.nome}</span> para remover{" "}
              <span className="rounded-full bg-[var(--crimson)] px-2 py-0.5 text-xs font-bold text-white">#{removerAlvo.idDemolay}</span>.
            </p>
            <input
              value={confirmNome}
              onChange={(e) => setConfirmNome(e.target.value)}
              placeholder={removerAlvo.nome}
              className="mt-4 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
              autoFocus
            />
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setRemoverAlvo(null);
                  setConfirmNome("");
                }}
                className="rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)]"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRemover}
                disabled={confirmNome.trim() !== removerAlvo.nome.trim()}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
              >
                Remover definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CampoTexto({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
      />
    </div>
  );
}

function CampoTextarea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">{label}</label>
      <textarea
        name={name}
        rows={3}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
      />
    </div>
  );
}
