import Image from "next/image";

type Premio = {
  id: string;
  imagemUrl: string;
  legenda: string | null;
  ordem: number;
};

type Props = {
  idDemolay: string;
  nome: string;
  fotoUrl?: string | null;
  cargoAtual?: string | null;
  historicoCargos?: string | null;
  premios?: Premio[];
};

export default function MemberCard({
  idDemolay,
  nome,
  fotoUrl,
  cargoAtual,
  historicoCargos,
  premios,
}: Props) {
  const linhasHistorico = historicoCargos
    ?.split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);

  return (
    <article className="flex flex-col overflow-hidden rounded border border-grafite/10 bg-white">
      <div className="relative aspect-square w-full bg-vermelho/5">
        {fotoUrl ? (
          <Image src={fotoUrl} alt={nome} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-vermelho/30 font-display text-3xl">
            {nome.charAt(0)}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-vermelho px-2 py-1 text-xs font-bold text-papel shadow">
          #{idDemolay}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg text-vermelho">{nome}</h3>
          {cargoAtual && (
            <p className="text-sm font-medium text-dourado">{cargoAtual}</p>
          )}
          <p className="text-xs text-grafite/50">ID DeMolay {idDemolay}</p>
        </div>

        {linhasHistorico && linhasHistorico.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-grafite/50">Histórico de cargos</p>
            <ul className="mt-1 space-y-0.5 text-sm text-grafite/80">
              {linhasHistorico.map((linha, indice) => (
                <li key={indice}>{linha}</li>
              ))}
            </ul>
          </div>
        )}

        {premios && premios.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-grafite/50">Prêmios e honrarias</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {premios.map((premio) => (
                <figure key={premio.id} className="overflow-hidden rounded border border-grafite/10 bg-grafite/5">
                  <div className="relative aspect-square w-full">
                    <Image src={premio.imagemUrl} alt={premio.legenda ?? `Prêmio de ${nome}`} fill className="object-cover" />
                  </div>
                  {premio.legenda && (
                    <figcaption className="px-1.5 py-1 text-[11px] leading-tight text-grafite/70 truncate" title={premio.legenda}>
                      {premio.legenda}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
