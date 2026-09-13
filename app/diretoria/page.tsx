import { prisma } from "@/lib/prisma";
import MemberCard from "@/components/MemberCard";

export const revalidate = 60;
export const metadata = {
  title: "Diretoria | Capítulo José Barreto de Albuquerque N°512",
};

export default async function DiretoriaPage() {
  const membros = await prisma.membro
    .findMany({
      where: { tipo: "DIRETORIA", ativo: true },
      orderBy: { ordem: "asc" },
    })
    .catch(() => []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-azul">Diretoria</h1>
      <p className="mt-4 max-w-prose text-grafite/80">
        Conheça os membros da diretoria do Capítulo José Barreto de
        Albuquerque N°512, seu histórico de cargos e as honrarias
        recebidas.
      </p>

      {membros.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {membros.map((membro) => (
            <MemberCard
              key={membro.id}
              nome={membro.nome}
              fotoUrl={membro.fotoUrl}
              cargoAtual={membro.cargoAtual}
              historicoCargos={membro.historicoCargos}
              premios={membro.premios}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-grafite/60">
          Os cards da diretoria aparecerão aqui assim que forem cadastrados
          pelo painel administrativo.
        </p>
      )}
    </section>
  );
}
