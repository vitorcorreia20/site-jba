import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const metadata = {
  title: "Quadro de lideranças | Capítulo José Barreto de Albuquerque N°512",
};

export default async function LiderancaPage() {
  const mestres = await prisma.mestreConselheiro
    .findMany({ orderBy: { ordem: "asc" } })
    .catch(() => []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-vermelho">
        Quadro de lideranças
      </h1>
      <p className="mt-4 max-w-prose text-grafite/80">
        Todos os Mestres Conselheiros que já conduziram o Capítulo José
        Barreto de Albuquerque N°512, em ordem cronológica.
      </p>

      {mestres.length > 0 ? (
        <ol className="mt-10 space-y-6 border-l-2 border-dourado/40 pl-6">
          {mestres.map((mestre: { id: string; nome: string; fotoUrl: string | null; periodo: string }, indice: number) => (
            <li key={mestre.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-dourado"
              />
              <div className="flex items-center gap-4">
                {mestre.fotoUrl && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-vermelho/20">
                    <Image
                      src={mestre.fotoUrl}
                      alt={mestre.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-display text-lg text-vermelho">
                    {mestre.nome}
                  </p>
                  <p className="text-sm text-grafite/60">{mestre.periodo}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-10 text-grafite/60">
          O histórico de Mestres Conselheiros aparecerá aqui assim que for
          cadastrado pelo painel administrativo.
        </p>
      )}
    </section>
  );
}
