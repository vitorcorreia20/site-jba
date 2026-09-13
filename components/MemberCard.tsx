import Image from "next/image";

type Props = {
  nome: string;
  fotoUrl?: string | null;
  cargoAtual?: string | null;
  historicoCargos?: string | null;
  premios?: string | null;
};

export default function MemberCard({
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
  const linhasPremios = premios
    ?.split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);

  return (
    <article className="flex flex-col overflow-hidden rounded border border-grafite/10 bg-white">
      <div className="relative aspect-square w-full bg-azul/5">
        {fotoUrl ? (
          <Image src={fotoUrl} alt={nome} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-azul/30 font-display text-3xl">
            {nome.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg text-azul">{nome}</h3>
          {cargoAtual && (
            <p className="text-sm font-medium text-dourado">{cargoAtual}</p>
          )}
        </div>

        {linhasHistorico && linhasHistorico.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-grafite/50">
              Histórico de cargos
            </p>
            <ul className="mt-1 space-y-0.5 text-sm text-grafite/80">
              {linhasHistorico.map((linha, indice) => (
                <li key={indice}>{linha}</li>
              ))}
            </ul>
          </div>
        )}

        {linhasPremios && linhasPremios.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-grafite/50">
              Prêmios e honrarias
            </p>
            <ul className="mt-1 space-y-0.5 text-sm text-grafite/80">
              {linhasPremios.map((linha, indice) => (
                <li key={indice}>{linha}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
