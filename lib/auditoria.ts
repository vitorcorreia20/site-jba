import { prisma } from "@/lib/prisma";

export type AcaoAuditoria =
  | "LOGIN"
  | "LOGIN_FALHA"
  | "CRIAR"
  | "EDITAR"
  | "REMOVER"
  | "ALTERAR_STATUS"
  | "UPLOAD";

export type EntidadeAuditoria =
  | "sessao"
  | "foto"
  | "membro"
  | "lideranca"
  | "solicitacao"
  | "contato"
  | "usuario"
  | "arquivo";

export type AtorAuditoria = {
  atorId?: string | null;
  atorNome?: string | null;
  atorEmail?: string | null;
  atorPapel?: string | null;
};

/** Monta o snapshot do ator a partir da sessão (nunca confia no client). */
export function atorDeSessao(session: {
  user?: { email?: string | null; name?: string | null; papel?: string; id?: string } | null;
} | null): AtorAuditoria {
  const user = (session?.user ?? {}) as { email?: string | null; name?: string | null; papel?: string; id?: string };
  return {
    atorId: user.id ?? null,
    atorNome: user.name ?? null,
    atorEmail: user.email ?? null,
    atorPapel: user.papel ?? null,
  };
}

/** Extrai o IP real atrás de proxies (Vercel/Neon). */
export function ipDeHeaders(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || null;
  return headers.get("x-real-ip");
}

/**
 * Registra um evento na trilha de auditoria. À prova de falha por desenho:
 * nunca quebra a operação principal, mesmo se o banco estiver fora.
 */
export async function registrarAuditoria(dados: {
  acao: AcaoAuditoria;
  entidade: EntidadeAuditoria;
  entidadeId?: string | null;
  detalhe?: string | null;
  ip?: string | null;
} & AtorAuditoria): Promise<void> {
  try {
    await prisma.auditoria.create({
      data: {
        atorId: dados.atorId ?? null,
        atorNome: dados.atorNome ?? null,
        atorEmail: dados.atorEmail ?? null,
        atorPapel: dados.atorPapel ?? null,
        acao: dados.acao,
        entidade: dados.entidade,
        entidadeId: dados.entidadeId ?? null,
        detalhe: dados.detalhe ? dados.detalhe.slice(0, 500) : null,
        ip: dados.ip ?? null,
      },
    });
  } catch {
    // auditoria é observabilidade: falhar aqui não pode derrubar login/CRUD
  }
}
