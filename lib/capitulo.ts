/**
 * Utilitários de idade/gestões do Capítulo José Barreto de Albuquerque N°512
 * Fundação: 28 de abril de 2002
 */

export const FUNDACAO = new Date(2002, 3, 28); // month 0-indexed: 3 = abril

/**
 * Retorna idade em anos completos desde 28/04/2002.
 * Ex: 27/04/2026 -> 23, 28/04/2026 -> 24
 */
export function getIdadeCapitulo(data: Date = new Date()): number {
  let anos = data.getFullYear() - 2002;
  const aniversarioNoAno = new Date(data.getFullYear(), 3, 28);
  if (data < aniversarioNoAno) anos--;
  return anos;
}

/**
 * Total de gestões semestrais: idade * 2
 * Ex: 24 anos -> 48 gestões (mantém padrão 23 -> 46)
 */
export function getGestoes(data: Date = new Date()): number {
  return getIdadeCapitulo(data) * 2;
}
