"use client";

import { useEffect, useState, FormEvent } from "react";

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
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function recarregar() {
    fetch("/api/admin/membros")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // garante ordenação crescente por idDemolay (string numérica)
          setMembros(
            [...data].sort((a: Membro, b: Membro) =>
              a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
            )
          );
        } else setMembros([]);
      });
  }

  useEffect(recarregar, []);

  function addPremio() {
    setPremiosDraft((prev) => [...prev, { imagemUrl: "", legenda: "" }]);
  }
  function updatePremio(idx: number, campo: keyof PremioDraft, valor: string) {
    setPremiosDraft((prev) => prev.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p)));
  }
  function removePremio(idx: number) {
    setPremiosDraft((prev) => prev.filter((_, i) => i !== idx));
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

    // validação simples de URL
    for (const p of premios) {
      try {
        new URL(p.imagemUrl);
      } catch {
        setErro(`URL de prêmio inválida: ${p.imagemUrl}`);
        return;
      }
    }

    const payload = {
      idDemolay,
      nome: dadosForm.nome?.trim(),
      tipo: dadosForm.tipo,
      fotoUrl: dadosForm.fotoUrl?.trim() || null,
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
      setErro(json.erro || json.detalhes ? JSON.stringify(json.detalhes) : "Erro ao criar membro");
      return;
    }

    setOk(`Membro #${idDemolay} criado com sucesso!`);
    form.reset();
    setPremiosDraft([]);
    recarregar();
  }

  async function remover(id: string) {
    if (!confirm("Remover membro?")) return;
    await fetch(`/api/admin/membros/${id}`, { method: "DELETE" });
    recarregar();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-xl text-vermelho">Novo membro</h2>
        <p className="text-xs text-grafite/60">ID DeMolay entre 5 e 9 dígitos. Ordenação é automática por ID crescente.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <CampoTexto label="ID DeMolay *" name="idDemolay" required placeholder="114329" type="text" />
          <CampoTexto label="Nome *" name="nome" required placeholder="Vitor dos Santos Correia" />
          <div>
            <label className="block text-sm font-medium text-grafite">Tipo de quadro</label>
            <select name="tipo" className="mt-1 w-full rounded border border-grafite/20 px-3 py-2">
              <option value="ATIVO">Quadro de ativos</option>
              <option value="DIRETORIA">Diretoria (aparece com card)</option>
            </select>
          </div>
          <CampoTexto label="URL da foto" name="fotoUrl" placeholder="https://..." />
          <CampoTexto label="Cargo atual" name="cargoAtual" placeholder="Mestre Conselheiro" />
          <CampoTextarea label="Histórico de cargos (um por linha)" name="historicoCargos" placeholder={"2024.1 - Hospitaleiro\n2025 - Tesoureiro"} />

          <div className="rounded border border-grafite/15 p-3 bg-white">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-grafite">Prêmios e honrarias — cada um é uma imagem</label>
              <button type="button" onClick={addPremio} className="text-xs rounded bg-vermelho px-2 py-1 text-papel hover:bg-vermelho-claro">+ Adicionar prêmio</button>
            </div>
            {premiosDraft.length === 0 && <p className="mt-2 text-xs text-grafite/50">Nenhum prêmio adicionado. Clique em “Adicionar prêmio”.</p>}
            <div className="mt-3 space-y-3">
              {premiosDraft.map((p, idx) => (
                <div key={idx} className="rounded border border-grafite/10 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-grafite/70">Prêmio #{idx + 1}</span>
                    <button type="button" onClick={() => removePremio(idx)} className="text-xs text-red-700 hover:underline">Remover</button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/premio.jpg"
                    value={p.imagemUrl}
                    onChange={(e) => updatePremio(idx, "imagemUrl", e.target.value)}
                    className="w-full rounded border border-grafite/20 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Legenda (opcional) ex: Chevalier - 2024"
                    value={p.legenda}
                    onChange={(e) => updatePremio(idx, "legenda", e.target.value)}
                    className="mt-2 w-full rounded border border-grafite/20 px-3 py-2 text-sm"
                  />
                  {p.imagemUrl && (
                    <div className="mt-2 h-20 relative overflow-hidden rounded border border-grafite/10">
                      {/* preview simples - permite URL externa, não usa next/image aqui */}
                      <img src={p.imagemUrl} alt={p.legenda || `Prêmio ${idx + 1}`} className="h-full w-full object-contain bg-grafite/5" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {erro && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{erro}</p>}
          {ok && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{ok}</p>}

          <button type="submit" className="w-full rounded bg-vermelho px-4 py-2 text-sm font-medium text-papel hover:bg-vermelho-claro">
            Adicionar membro
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl text-vermelho">Membros cadastrados (ordem crescente por ID)</h2>
        <ul className="mt-4 space-y-2">
          {membros?.map((m) => (
            <li key={m.id} className="flex flex-col gap-1 rounded border border-grafite/10 bg-white px-4 py-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-grafite">
                  <span className="inline-block rounded bg-vermelho/10 text-vermelho px-1.5 py-0.5 text-xs mr-2">#{m.idDemolay}</span>
                  {m.nome}
                </span>
                <button onClick={() => remover(m.id)} className="shrink-0 text-red-700 hover:underline text-xs">
                  Remover
                </button>
              </div>
              <span className="text-xs text-grafite/60">
                {m.tipo === "ATIVO" ? "Ativo" : "Diretoria"}
                {m.cargoAtual ? ` · ${m.cargoAtual}` : ""}
                {m.premios?.length ? ` · ${m.premios.length} prêmio(s)` : ""}
              </span>
              {m.premios && m.premios.length > 0 && (
                <div className="mt-1 flex gap-1 flex-wrap">
                  {m.premios.slice(0, 4).map((pr) => (
                    <img key={pr.id} src={pr.imagemUrl} alt={pr.legenda ?? ""} title={pr.legenda ?? ""} className="h-10 w-10 rounded border border-grafite/10 object-cover" />
                  ))}
                  {m.premios.length > 4 && <span className="text-xs text-grafite/50 self-center">+{m.premios.length - 4}</span>}
                </div>
              )}
            </li>
          ))}
          {membros?.length === 0 && <p className="text-grafite/60">Nenhum membro cadastrado ainda.</p>}
        </ul>
      </div>
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
      <label className="block text-sm font-medium text-grafite">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded border border-grafite/20 px-3 py-2 placeholder:text-grafite/40"
      />
    </div>
  );
}

function CampoTextarea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-grafite">{label}</label>
      <textarea
        name={name}
        rows={3}
        placeholder={placeholder}
        className="mt-1 w-full rounded border border-grafite/20 px-3 py-2 placeholder:text-grafite/40"
      />
    </div>
  );
}
