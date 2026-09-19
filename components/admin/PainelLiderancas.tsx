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

  function recarregar() {
    fetch("/api/admin/liderancas")
      .then((r) => r.json())
      .then(setMestres);
  }

  useEffect(recarregar, []);

  function parseGestao(periodo: string): number {
    const m = periodo.match(/^(\d{4})\.([12])$/);
    if (m) return Number(m[1]) * 10 + Number(m[2]);
    const y = periodo.match(/\b(19|20)\d{2}\b/);
    if (y) return Number(y[0]) * 10;
    return 0;
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
        <p className="text-xs text-[var(--ink)]/40">Exclusão exige digitar o nome exato.</p>
        <ul className="mt-4 space-y-2">
          {mestres?.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2 rounded-[12px] border border-[var(--ink-faint)] bg-white px-4 py-3 text-sm shadow-sm">
              <span>
                <strong className="text-[var(--ink)]">{m.nome}</strong> <span className="text-[var(--ink)]/50">— {m.periodo}</span>
              </span>
              <button
                onClick={() => {
                  setRemoverAlvo(m);
                  setConfirmNome("");
                }}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Remover
              </button>
            </li>
          ))}
          {mestres?.length === 0 && (
            <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
              Nenhum Mestre cadastrado. Histórico incompleto – adicione os nomes confirmados.
            </li>
          )}
        </ul>
      </div>

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
