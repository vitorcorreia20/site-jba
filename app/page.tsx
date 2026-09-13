import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const fotos = await prisma.fotoAcao
    .findMany({ orderBy: { ordem: "asc" } })
    .catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className="bg-vermelho-escuro text-papel">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-display italic text-dourado-claro text-lg">
            Ordem DeMolay
          </p>
          <h1 className="mt-2 max-w-prose font-display text-4xl leading-tight sm:text-5xl">
            Capítulo José Barreto de Albuquerque N°512
          </h1>
          <p className="mt-6 max-w-prose text-papel/85">
            Formando jovens líderes através do civismo, da fraternidade e do
            caráter — há gerações servindo nossa comunidade.
          </p>
          <Link
            href="/quero-fazer-parte"
            className="mt-8 inline-block rounded bg-dourado px-6 py-3 font-medium text-vermelho-escuro transition-colors hover:bg-dourado-claro"
          >
            Quero fazer parte
          </Link>
        </div>
      </section>

      {/* História */}
      <section className="mx-auto max-w-6xl px-6 py-16 bg-papel rounded-t-3xl -mt-6 relative">
        <h2 className="font-display text-3xl text-vermelho">Nossa história</h2>
        <div className="mt-6 max-w-prose space-y-4 text-grafite/90">
          <p>
            [Espaço reservado para a história do Capítulo José Barreto de
            Albuquerque N°512 — ano de fundação, origem do nome, marcos
            importantes e a trajetória do capítulo dentro da Ordem DeMolay.]
          </p>
          <p>
            [Edite este texto pelo painel administrativo ou diretamente no
            arquivo <code>app/page.tsx</code> antes de publicar.]
          </p>
        </div>
      </section>

      {/* Fotos de ações */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl text-vermelho">Nossas ações</h2>
          <p className="mt-2 max-w-prose text-grafite/70">
            Registros de atividades, eventos e trabalhos comunitários do
            capítulo.
          </p>

          {fotos.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {fotos.map((foto: { id: string; url: string; legenda: string | null }) => (
                <figure
                  key={foto.id}
                  className="overflow-hidden rounded border border-black/5"
                >
                  <div className="relative aspect-[4/3] w-full bg-vermelho/5">
                    <Image
                      src={foto.url}
                      alt={foto.legenda ?? "Ação do capítulo"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {foto.legenda && (
                    <figcaption className="px-3 py-2 text-sm text-grafite/70">
                      {foto.legenda}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-grafite/60">
              As fotos das ações do capítulo aparecerão aqui assim que forem
              cadastradas pelo painel administrativo.
            </p>
          )}
        </div>
      </section>

      {/* Apoio */}
      <section className="bg-dourado/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl text-vermelho">Apoie o capítulo</h2>
          <p className="mt-4 max-w-prose text-grafite/90">
            O trabalho do Capítulo José Barreto de Albuquerque N°512 é
            mantido com o apoio de familiares, ex-membros e da comunidade.
            Se você quiser contribuir com nossas atividades, entre em
            contato com a diretoria.
          </p>
          <div className="mt-6 rounded border border-dourado/40 bg-white p-6 max-w-md">
            <p className="text-sm text-grafite/70">
              [Espaço reservado para dados de contato, PIX ou link de
              doação da diretoria.]
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
