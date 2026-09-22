"use client";

import { useEffect, useState, FormEvent } from "react";

type Papel = "DIRETORIA" | "COMISSAO";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  criadoEm: string;
};

function labelPapel(p: Papel) {
  return p === "DIRETORIA" ? "Administração" : "Gestor";
}

export default function PainelUsuarios({ emailAtual }: { emailAtual?: string }) {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // criação
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<Papel>("COMISSAO");

  // edição
  const [editAlvo, setEditAlvo] = useState<Usuario | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [editPapel, setEditPapel] = useState<Papel>("COMISSAO");
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  // remoção
  const [removerAlvo, setRemoverAlvo] = useState<Usuario | null>(null);
  const [confirmNome, setConfirmNome] = useState("");

  function recarregar() {
    fetch("/api/admin/usuarios")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.erro || "Erro ao carregar usuários");
        return data;
      })
      .then((data) => {
        if (Array.isArray(data)) setUsuarios(data);
        else setUsuarios([]);
      })
      .catch((e) => setErro(e.message));
  }

  useEffect(recarregar, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setOk(null);
    const nomeTrim = nome.trim();
    const emailTrim = email.trim().toLowerCase();
    if (nomeTrim.length < 2) {
      setErro("Nome deve ter ao menos 2 caracteres.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setErro("E-mail inválido.");
      return;
    }
    if (senha.length < 6) {
      setErro("Senha deve ter ao menos 6 caracteres.");
      return;
    }

    setCarregando(true);
    const resp = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeTrim, email: emailTrim, senha, papel }),
    });
    const json = await resp.json();
    setCarregando(false);
    if (!resp.ok) {
      const detalhe = json.detalhes ? JSON.stringify(json.detalhes) : "";
      setErro(json.erro || detalhe || "Erro ao criar usuário");
      return;
    }
    setOk(`Usuário ${json.email} [${labelPapel(json.papel as Papel)}] criado com sucesso!`);
    setNome("");
    setEmail("");
    setSenha("");
    setPapel("COMISSAO");
    recarregar();
  }

  function abrirEdicao(u: Usuario) {
    setEditAlvo(u);
    setEditNome(u.nome);
    setEditEmail(u.email);
    setEditSenha("");
    setEditPapel(u.papel);
    setErro(null);
    setOk(null);
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!editAlvo) return;
    setErro(null);
    setOk(null);
    const payload: Record<string, string> = {};
    const nomeTrim = editNome.trim();
    const emailTrim = editEmail.trim().toLowerCase();
    if (nomeTrim && nomeTrim !== editAlvo.nome) payload.nome = nomeTrim;
    if (emailTrim && emailTrim !== editAlvo.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        setErro("E-mail inválido.");
        return;
      }
      payload.email = emailTrim;
    }
    if (editPapel !== editAlvo.papel) payload.papel = editPapel;
    if (editSenha) {
      if (editSenha.length < 6) {
        setErro("Senha deve ter ao menos 6 caracteres.");
        return;
      }
      payload.senha = editSenha;
    }
    if (Object.keys(payload).length === 0) {
      setErro("Nenhuma alteração detectada.");
      return;
    }

    setSalvandoEdit(true);
    const resp = await fetch(`/api/admin/usuarios/${editAlvo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    setSalvandoEdit(false);
    if (!resp.ok) {
      const detalhe = json.detalhes ? JSON.stringify(json.detalhes) : "";
      setErro(json.erro || detalhe || "Erro ao atualizar usuário");
      return;
    }
    setOk(`Usuário ${json.email} atualizado.`);
    setEditAlvo(null);
    setEditSenha("");
    recarregar();
  }

  async function confirmarRemover() {
    if (!removerAlvo) return;
    if (confirmNome.trim() !== removerAlvo.nome.trim()) {
      setErro(`Digite exatamente "${removerAlvo.nome}" para confirmar.`);
      return;
    }
    setErro(null);
    const resp = await fetch(`/api/admin/usuarios/${removerAlvo.id}`, { method: "DELETE" });
    const json = await resp.json();
    if (!resp.ok) {
      setErro(json.erro || "Erro ao remover usuário");
      return;
    }
    setOk(`Usuário ${removerAlvo.email} removido.`);
    setRemoverAlvo(null);
    setConfirmNome("");
    recarregar();
  }

  const emailAtualNorm = emailAtual?.trim().toLowerCase();

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
      {/* Formulário criação */}
      <div className="rounded-[16px] border border-[var(--ink-faint)] bg-[var(--paper)] p-4 sm:p-5">
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Cadastrar usuário</h2>
        <p className="text-xs leading-relaxed text-[var(--ink)]/50">
          Crie acessos de <strong>Administração</strong> (acesso total) ou <strong>Gestor</strong> (solicitações, contatos e fotos). E-mail será normalizado em minúsculas.
        </p>
        <form onSubmit={handleCreate} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Nome *</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Ex: João Silva"
              className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">E-mail *</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="gestor@exemplo.com"
              className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Senha *</label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              type="password"
              placeholder="mín. 6 caracteres"
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3.5 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Papel *</label>
            <select
              value={papel}
              onChange={(e) => setPapel(e.target.value as Papel)}
              className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
            >
              <option value="DIRETORIA">Administração — acesso total</option>
              <option value="COMISSAO">Gestor — solicitações, contatos e fotos</option>
            </select>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--ink)]/40">
              Gestor acessa Solicitações, Contatos e Fotos de ações (criar/editar; excluir só Administração). Administração gerencia tudo, inclusive usuários.
            </p>
          </div>

          {erro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
          {ok && <p className="rounded-[10px] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-full bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-[var(--crimson-deep)] disabled:opacity-60"
          >
            {carregando ? "Cadastrando..." : "Cadastrar usuário"}
          </button>
        </form>
      </div>

      {/* Lista */}
      <div>
        <h2 className="font-display text-[15px] font-semibold text-[var(--crimson)]">Usuários cadastrados ({usuarios?.length ?? 0})</h2>
        <p className="text-xs text-[var(--ink)]/40">Edite papel/senha ou remova. Você não pode remover a si mesmo.</p>
        <ul className="mt-4 space-y-2">
          {usuarios?.map((u) => {
            const isSelf = emailAtualNorm && u.email.toLowerCase() === emailAtualNorm;
            return (
              <li key={u.id} className="rounded-[12px] border border-[var(--ink-faint)] bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium text-[var(--ink)]">{u.nome}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          u.papel === "DIRETORIA"
                            ? "bg-[var(--crimson)] text-white"
                            : "bg-[var(--gold-faint)] text-[var(--crimson)] border border-[var(--gold-border)]"
                        }`}
                      >
                        {labelPapel(u.papel)}
                      </span>
                      {isSelf && (
                        <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          você
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-[var(--ink)]/60 sm:break-all">{u.email}</p>
                    <p className="text-[11px] text-[var(--ink)]/30">criado em {new Date(u.criadoEm).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex gap-1.5 sm:shrink-0">
                    <button
                      onClick={() => abrirEdicao(u)}
                      className="flex-1 rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)] sm:flex-none sm:py-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setRemoverAlvo(u);
                        setConfirmNome("");
                        setErro(null);
                      }}
                      disabled={!!isSelf}
                      title={isSelf ? "Não é possível remover a si mesmo" : "Remover usuário"}
                      className="flex-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed sm:flex-none sm:py-1"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {usuarios?.length === 0 && (
            <li className="rounded-[12px] border border-dashed border-[var(--ink-faint)] bg-[var(--paper)] p-6 text-center text-sm text-[var(--ink)]/50">
              Nenhum usuário encontrado.
            </li>
          )}
          {usuarios === null && <li className="text-sm text-[var(--ink)]/40">Carregando...</li>}
        </ul>
      </div>

      {/* Modal edição */}
      {editAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-strong">
            <div className="overflow-y-auto p-4 sm:p-6">
            <h3 className="font-display text-base font-semibold text-[var(--crimson)]">Editar usuário</h3>
            <p className="mt-1 break-words text-xs text-[var(--ink)]/50">
              Editando <span className="font-semibold text-[var(--ink)]">{editAlvo.nome}</span> ({editAlvo.email})
            </p>
            <form onSubmit={handleEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Nome</label>
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  placeholder={editAlvo.nome}
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">E-mail</label>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  type="email"
                  placeholder={editAlvo.email}
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Nova senha (deixe em branco para manter)</label>
                <input
                  value={editSenha}
                  onChange={(e) => setEditSenha(e.target.value)}
                  type="password"
                  placeholder="mín. 6 caracteres"
                  autoComplete="new-password"
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">Papel</label>
                <select
                  value={editPapel}
                  onChange={(e) => setEditPapel(e.target.value as Papel)}
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
                >
                  <option value="DIRETORIA">Administração</option>
                  <option value="COMISSAO">Gestor</option>
                </select>
              </div>
              {erro && <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditAlvo(null);
                    setEditSenha("");
                    setErro(null);
                  }}
                  className="rounded-full border border-[var(--ink-faint)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper-2)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoEdit}
                  className="rounded-full bg-[var(--crimson)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--crimson-deep)] disabled:opacity-40"
                >
                  {salvandoEdit ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* Modal remoção */}
      {removerAlvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[18px] border border-[var(--ink-faint)] bg-white p-4 shadow-strong sm:p-6">
            <h3 className="font-display text-base font-semibold text-[var(--crimson)]">Confirmar exclusão</h3>
            <p className="mt-2 break-words text-sm leading-relaxed text-[var(--ink-soft)]">
              Digite exatamente <span className="font-semibold text-[var(--ink)]">{removerAlvo.nome}</span> para remover{" "}
              <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 text-xs font-bold text-white break-all">{removerAlvo.email}</span>{" "}
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${removerAlvo.papel === "DIRETORIA" ? "bg-[var(--crimson)] text-white" : "bg-[var(--gold-faint)] text-[var(--crimson)] border border-[var(--gold-border)]"}`}>
                {labelPapel(removerAlvo.papel)}
              </span>
              .
            </p>
            <input
              value={confirmNome}
              onChange={(e) => setConfirmNome(e.target.value)}
              placeholder={removerAlvo.nome}
              className="mt-4 w-full rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
              autoFocus
            />
            {erro && <p className="mt-3 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setRemoverAlvo(null);
                  setConfirmNome("");
                  setErro(null);
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
