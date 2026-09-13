import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const metadata = {
  title: "Quadro de ativos | Capítulo José Barreto de Albuquerque N°512",
};

export default async function AtivosPage() {
  const membros = await prisma.membro
    .findMany({
      where: { tipo: "ATIVO", ativo: true },
      orderBy: { ordem: "asc" },
    })
    .catch(() => []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-azul">Quadro de ativos</h1>
      <p className="mt-4 max-w-prose text-grafite/80">
        Membros atualmente ativos no Capítulo José Barreto de Albuquerque
        N°512 e seus respectivos cargos.
      </p>

      {membros.length > 0 ? (
        <ul className="mt-10 divide-y divide-grafite/10 rounded border border-grafite/10">
          {membros.map((membro: { id: string; nome: string; cargoAtual: string | null }) => (
            <li
              key={membro.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <span className="font-medium text-grafite">{membro.nome}</span>
              <span className="text-sm text-grafite/60">
                {membro.cargoAtual ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-grafite/60">
          A lista de membros ativos aparecerá aqui assim que for cadastrada
          pelo painel administrativo.
        </p>
      )}
    </section>
  );
}
