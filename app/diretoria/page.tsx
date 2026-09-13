import { prisma } from "@/lib/prisma";
import MemberCard from "@/components/MemberCard";

export const revalidate = 60;
export const metadata = {
  title: "Diretoria | Capítulo José Barreto de Albuquerque N°512",
};

export default async function DiretoriaPage() {
  const raw = await prisma.membro
    .findMany({
      where: { tipo: "DIRETORIA", ativo: true },
      include: { premios: { orderBy: { ordem: "asc" } } },
    })
    .catch(() => []);
  const membros = raw.sort((a, b) =>
    a.idDemolay.localeCompare(b.idDemolay, undefined, { numeric: true })
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="bg-papel rounded-xl p-6">
        <h1 className="font-display text-4xl text-vermelho">Diretoria</h1>
        <p className="mt-4 max-w-prose text-grafite/80">
          Conheça os membros da diretoria — ordenados por ID DeMolay crescente. Cada prêmio é exibido como imagem.
        </p>
      </div>

      {membros.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {membros.map((membro) => (
            <MemberCard
              key={membro.id}
              idDemolay={membro.idDemolay}
              nome={membro.nome}
              fotoUrl={membro.fotoUrl}
              cargoAtual={membro.cargoAtual}
              historicoCargos={membro.historicoCargos}
              premios={membro.premios}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-papel/80">
          Os cards da diretoria aparecerão aqui assim que forem cadastrados pelo painel administrativo.
        </p>
      )}
    </section>
  );
}
