import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const VISITANTE_COOKIE = "jba_visitante";
const CINCO_ANOS = 5 * 365 * 24 * 60 * 60;

export function obterVisitanteId(): string | undefined {
  return cookies().get(VISITANTE_COOKIE)?.value;
}

export function cookieVisitanteOptions() {
  return {
    name: VISITANTE_COOKIE,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: CINCO_ANOS,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Gera um novo id quando o visitante ainda não tem cookie. */
export function novoVisitanteId() {
  return randomUUID();
}

export type FotoGaleria = {
  id: string;
  url: string;
  legenda: string | null;
  dataRealizada: string;
  totalCurtidas: number;
  curtido: boolean;
};
