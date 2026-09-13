import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const metadata = {
  title: "Quadro de ativos | Capítulo José Barreto de Albuquerque N°512",
};

export default async function AtivosPage() {
  const raw = await prisma.membro
    .findMany({
      where: { tipo: "ATIVO", ativo: true },
      include: { premios: { orderBy: { ordem: "asc" } } },
    })
    .catch(() => []);
  const membros = raw.sort((a, b) =>
    a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
  );

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 bg-papel/95 rounded-xl mt-6">
      <h1 className="font-display text-4xl text-vermelho">Quadro de ativos</h1>
      <p className="mt-4 max-w-prose text-grafite/80">
        Membros atualmente ativos no Capítulo José Barreto de Albuquerque N°512 — ordenados por ID DeMolay crescente.
      </p>

      {membros.length > 0 ? (
        <ul className="mt-10 divide-y divide-grafite/10 rounded border border-grafite/10 bg-white overflow-hidden">
          {membros.map((membro) => (
            <li key={membro.id} className="flex items-center gap-4 px-5 py-4 hover:bg-vermelho/5">
              <span className="shrink-0 rounded bg-vermelho px-2 py-1 text-xs font-medium text-papel">#{membro.idDemolay}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-grafite truncate">{membro.nome}</p>
                <p className="text-xs text-grafite/60">{membro.cargoAtual ?? "—"}</p>
              </div>
              {membro.fotoUrl && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-vermelho/20">
                  <Image src={membro.fotoUrl} alt={membro.nome} fill className="object-cover" />
                </div>
              )}
              {membro.premios.length > 0 && (
                <div className="hidden sm:flex gap-1">
                  {membro.premios.slice(0, 3).map((pr) => (
                    <div key={pr.id} className="relative h-8 w-8 overflow-hidden rounded border border-grafite/10" title={pr.legenda ?? ""}>
                      <Image src={pr.imagemUrl} alt={pr.legenda ?? "Prêmio"} fill className="object-cover" />
                    </div>
                  ))}
                  {membro.premios.length > 3 && <span className="text-xs text-grafite/50 self-center">+{membro.premios.length - 3}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-grafite/60">
          A lista de membros ativos aparecerá aqui assim que for cadastrada pelo painel administrativo.
        </p>
      )}
    </section>
  );
}
