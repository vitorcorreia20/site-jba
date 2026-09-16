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
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-[var(--ink-faint)] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-strong">
      {/* Foto – editorial 4/3.2, não square */}
      <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-[var(--paper-2)]">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-[var(--paper-2)]">
            <span className="numeral-watermark text-4xl font-black text-[var(--crimson)]/12">
              512
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--crimson)]/10 bg-white font-display text-2xl font-bold text-[var(--crimson)]/40">
              {nome.charAt(0)}
            </span>
          </div>
        )}

        {/* overlay sutil para legibilidade do badge */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

        {/* Badge ID – pill gold/crimson */}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--crimson)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow">
          #{idDemolay}
        </span>

        {/* losango decorativo */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 hidden h-5 w-5 rotate-45 border border-white/20 bg-white/10 backdrop-blur sm:block"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-[17px] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
            {nome}
          </h3>
          {cargoAtual && (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gold)]">
              {cargoAtual}
            </p>
          )}
          <p className="mt-1 text-[11px] font-medium tracking-wide text-[var(--ink)]/40">
            ID DeMolay {idDemolay}
          </p>
        </div>

        {linhasHistorico && linhasHistorico.length > 0 && (
          <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper)]/60 p-3">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink)]/40">
              <span className="h-px w-4 bg-[var(--gold)]/40" />
              Histórico de cargos
            </p>
            <ul className="mt-2 space-y-1 text-[13px] leading-snug text-[var(--ink-soft)]">
              {linhasHistorico.map((linha, indice) => (
                <li key={indice} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/60" />
                  <span>{linha}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {premios && premios.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink)]/40">
              <span className="h-px w-4 bg-[var(--gold)]/40" />
              Prêmios e honrarias
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {premios.map((premio) => (
                <figure
                  key={premio.id}
                  className="overflow-hidden rounded-[10px] border border-[var(--ink-faint)] bg-[var(--paper-2)] transition-transform hover:scale-[1.02]"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={premio.imagemUrl}
                      alt={premio.legenda ?? `Prêmio de ${nome}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  {premio.legenda && (
                    <figcaption
                      className="truncate px-1.5 py-1 text-[11px] leading-tight text-[var(--ink-soft)]"
                      title={premio.legenda}
                    >
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
