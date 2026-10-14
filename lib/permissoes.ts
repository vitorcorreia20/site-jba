import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export type PapelAdmin = "MASTER" | "DIRETORIA" | "COMISSAO";

type SessaoComPapel = {
  user?: { email?: string | null; name?: string | null; papel?: string } | null;
};

/** Extrai o papel da sessão (undefined quando ausente/inválido). */
export function papelDaSessao(session: SessaoComPapel | null): PapelAdmin | undefined {
  const papel = session?.user?.papel;
  if (papel === "MASTER" || papel === "DIRETORIA" || papel === "COMISSAO") return papel;
  return undefined;
}

export function isMaster(papel: string | undefined): boolean {
  return papel === "MASTER";
}

/** DIRETOIRA + MASTER — quem tem poder administrativo amplo. */
export function isDiretoriaOuMaster(papel: string | undefined): boolean {
  return papel === "DIRETORIA" || papel === "MASTER";
}

/** Só o MASTER gerencia usuários, métricas e auditoria. */
export function podeGerenciarUsuarios(papel: string | undefined): boolean {
  return papel === "MASTER";
}

/** MASTER, DIRETORIA ou COMISSAO — qualquer papel válido. */
export function isPapelValido(papel: string | undefined): papel is PapelAdmin {
  return papel === "MASTER" || papel === "DIRETORIA" || papel === "COMISSAO";
}

type SessaoOk = {
  session: SessaoAdmin;
  papel: PapelAdmin;
};

/** Formato mínimo de sessão usado pelo painel (papel vem no JWT). */
export type SessaoAdmin = {
  user?: { email?: string | null; name?: string | null; papel?: string; id?: string } | null;
};

/** Exige login; retorna 401 quando ausente. Papéis legados sem `papel` exigem novo login. */
export async function requireSessao(): Promise<SessaoOk | { error: NextResponse }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ erro: "Não autenticado" }, { status: 401 }) };
  }
  const papel = papelDaSessao(session as SessaoComPapel);
  if (!papel) {
    return {
      error: NextResponse.json({ erro: "Sessão desatualizada. Faça login novamente." }, { status: 401 }),
    };
  }
  return { session: session as unknown as SessaoAdmin, papel };
}

/** Exige DIRETORIA ou MASTER; COMISSAO recebe 403. */
export async function requireDiretoriaOuMaster(): Promise<SessaoOk | { error: NextResponse }> {
  const auth = await requireSessao();
  if ("error" in auth) return auth;
  if (!isDiretoriaOuMaster(auth.papel)) {
    return { error: NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 }) };
  }
  return auth;
}

/** Exige MASTER; demais papéis recebem 403. Gestão de usuários, métricas e auditoria. */
export async function requireMaster(): Promise<SessaoOk | { error: NextResponse }> {
  const auth = await requireSessao();
  if ("error" in auth) return auth;
  if (!isMaster(auth.papel)) {
    return { error: NextResponse.json({ erro: "Acesso restrito ao Master" }, { status: 403 }) };
  }
  return auth;
}
