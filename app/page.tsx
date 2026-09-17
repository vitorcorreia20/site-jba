import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CopyPixButton from "@/components/CopyPixButton";
import Historia from "@/components/Historia";

export const revalidate = 60;

export default async function HomePage() {
  const fotos = await prisma.fotoAcao
    .findMany({ orderBy: { ordem: "asc" } })
    .catch(() => []);

  const fotoDestaque = fotos[0];
  const demaisFotos = fotos.slice(1);

  return (
    <>
      {/* ========== HERO – acolhedor / convite ========== */}
      <section className="relative overflow-hidden bg-[var(--crimson)] text-[var(--paper)]">
        {/* mesh radial solene atrás */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(201,162,39,0.10),transparent_60%),radial-gradient(ellipse_60%_40%_at_90%_80%,rgba(0,0,0,0.18),transparent_60%)]"
        />
        {/* watermark 512 – âncora memorável */}
        <div
          aria-hidden
          className="numeral-watermark pointer-events-none absolute -right-8 top-6 select-none text-[42vw] font-black leading-none text-white/[0.035] sm:text-[30vw] lg:right-0 lg:text-[22vw]"
        >
          512
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-20">
          {/* Esquerda 7 cols */}
          <div className="lg:col-span-7">
            <p className="hero-in text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-light)]/90">
              Ordem DeMolay · 23 anos de história
            </p>

            <h1 className="hero-in-2 mt-3 font-display text-[clamp(2.2rem,5vw,3.55rem)] font-semibold leading-[0.95] tracking-tight">
              Capítulo José Barreto
              <br />
              <span className="font-normal text-white/90">de Albuquerque</span>{" "}
              <span className="whitespace-nowrap font-black text-[var(--gold)]">
                N°512
              </span>
            </h1>

            <p className="hero-in-3 mt-5 max-w-[52ch] text-[15px] leading-relaxed text-white/75">
              Formando jovens líderes através do civismo, da fraternidade e do
              caráter — há 23 anos e 46 gestões servindo nossa comunidade.
            </p>

            <div className="hero-in-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/quero-fazer-parte"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3 text-[14px] font-semibold text-[var(--crimson-deep)] shadow-soft transition-all hover:bg-[var(--gold-light)] hover:-translate-y-px hover:shadow-strong"
              >
                Quero fazer parte <span aria-hidden>→</span>
              </Link>
              <Link
                href="#historia"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[14px] font-medium text-white/85 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
              >
                Conheça nossa história
              </Link>
            </div>

            {/* stats discretas */}
            <div className="hero-in-3 mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6 text-xs">
              <span className="flex items-center gap-2 text-white/60">
                <span className="h-px w-6 bg-[var(--gold)]/50" />
                <strong className="font-semibold text-white">23</strong> anos
              </span>
              <span className="flex items-center gap-2 text-white/60">
                <span className="h-px w-6 bg-[var(--gold)]/30" />
                <strong className="font-semibold text-white">46</strong> gestões semestrais
              </span>
              <span className="flex items-center gap-2 text-white/60">
                <span className="h-px w-6 bg-[var(--gold)]/30" />
                Capítulo <strong className="font-semibold text-white">N°512</strong>
              </span>
            </div>
          </div>

          {/* Direita 5 cols – foto destaque / placeholder */}
          <div className="hero-in-3 lg:col-span-5">
            <div className="relative">
              {/* moldura dourada sutil */}
              <div className="relative overflow-hidden rounded-[18px] border border-[var(--gold)]/25 bg-[var(--crimson-deep)] p-[5px] shadow-strong">
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-[13px] bg-[var(--paper-2)]">
                  {fotoDestaque ? (
                    <>
                      <Image
                        src={fotoDestaque.url}
                        alt={fotoDestaque.legenda ?? "Ação do capítulo em destaque"}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                      />
                      {fotoDestaque.legenda && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-10">
                          <p className="text-sm font-medium leading-snug text-white drop-shadow">
                            {fotoDestaque.legenda}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[var(--paper-2)] p-8 text-center">
                      <span className="numeral-watermark text-6xl font-black text-[var(--crimson)]/10">
                        512
                      </span>
                      <p className="font-display text-lg font-semibold text-[var(--crimson)]">
                        Nossas ações em imagens
                      </p>
                      <p className="max-w-[28ch] text-sm leading-relaxed text-[var(--ink-soft)]">
                        As fotos das atividades aparecerão aqui assim que forem
                        cadastradas no painel administrativo.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* selo lacre inferior esquerdo – tipográfico */}
              <div className="absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--paper)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--crimson)] shadow-soft sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] font-black text-[var(--crimson-deep)]">
                  512
                </span>
                Desde 2002
              </div>

              {/* losango decorativo */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-3 hidden h-6 w-6 rotate-45 border border-[var(--gold)]/20 bg-[var(--gold)]/10 lg:block"
              />
            </div>

            {fotos.length > 1 && (
              <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-wide text-white/50 lg:text-right">
                +{fotos.length - 1} registros em{" "}
                <Link href="#acoes" className="underline decoration-white/20 underline-offset-4 hover:text-white/80">
                  Nossas ações
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ========== HISTÓRIA – solene editorial ========== */}
      <section
        id="historia"
        className="relative -mt-6 rounded-t-[28px] border-t border-[var(--gold-border)] bg-[var(--paper)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16 lg:py-20">
          {/* header editorial */}
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Nossa história
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
              23 anos formando caráter,
              <br />
              <span className="font-normal italic text-[var(--ink)]/80">gestão após gestão.</span>
            </h2>
            <div className="divider-diamond mt-6 max-w-md">
              <span>◆</span>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* texto – 7 cols */}
            <div className="lg:col-span-7">
              <Historia />
              <Link
                href="/lideranca"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--crimson)] underline decoration-[var(--gold)]/30 underline-offset-4 hover:text-[var(--crimson-deep)]"
              >
                Ver quadro completo de lideranças <span aria-hidden>→</span>
              </Link>
            </div>

            {/* lateral editorial – 5 cols */}
            <div className="space-y-6 lg:col-span-5">
              {/* pull-quote */}
              <blockquote className="relative border-l-2 border-[var(--gold)] bg-white px-6 py-6 shadow-soft">
                <p className="font-display text-[17px] font-medium italic leading-relaxed text-[var(--ink)]">
                  “O JBA 512 não pertence somente a quem está aqui hoje.”
                </p>
                <footer className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--stone)]">
                  — História do Capítulo 512
                </footer>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 rotate-45 border border-[var(--gold)]/15 bg-[var(--gold-faint)]"
                />
              </blockquote>

              {/* stats 23 anos */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "23", l: "anos de\n história" },
                  { n: "46", l: "gestões\n semestrais" },
                  { n: "512", l: "número do\n capítulo" },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="rounded-[14px] border border-[var(--ink-faint)] bg-[var(--paper-2)] px-3 py-4 text-center"
                  >
                    <p className="font-display text-2xl font-black leading-none text-[var(--crimson)]">
                      {s.n}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-[10px] font-semibold uppercase leading-tight tracking-wide text-[var(--stone)]">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-[var(--stone)]">
                Cada semestre um novo Mestre Conselheiro assume a condução do
                capítulo — tradição que mantém viva a formação de líderes desde
                2002.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== NOSSAS AÇÕES – solene, editorial ========== */}
      <section id="acoes" className="bg-[var(--paper-2)] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                Registros
              </p>
              <h2 className="mt-1 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[var(--crimson)]">
                Nossas ações
              </h2>
              <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-[var(--ink-soft)]">
                Ações filantrópicas, eventos e trabalhos comunitários do capítulo
                — cada imagem conta um semestre de serviço.
              </p>
            </div>
            {fotos.length > 0 && (
              <p className="rounded-full border border-[var(--ink-faint)] bg-white px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
                {fotos.length} registro{fotos.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {fotos.length > 0 ? (
            <div className="mt-8 grid auto-rows-[176px] grid-cols-12 gap-4">
              {/* featured – ocupa 8 cols + 2 rows */}
              <figure className="group relative col-span-12 overflow-hidden rounded-[14px] border border-[var(--ink-faint)] bg-white shadow-soft md:col-span-8 md:row-span-2">
                <div className="relative h-full w-full bg-[var(--crimson)]/5">
                  <Image
                    src={fotos[0].url}
                    alt={fotos[0].legenda ?? "Ação do capítulo em destaque"}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-90" />
                  {fotos[0].legenda && (
                    <figcaption className="absolute inset-x-0 bottom-0 p-4">
                      <p className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--ink)] backdrop-blur">
                        {fotos[0].legenda}
                      </p>
                    </figcaption>
                  )}
                </div>
              </figure>

              {fotos.slice(1, 7).map((foto) => (
                <figure
                  key={foto.id}
                  className="group relative col-span-12 overflow-hidden rounded-[14px] border border-[var(--ink-faint)] bg-white shadow-soft sm:col-span-6 md:col-span-4"
                >
                  <div className="relative h-full w-full bg-[var(--crimson)]/5">
                    <Image
                      src={foto.url}
                      alt={foto.legenda ?? "Ação do capítulo"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {foto.legenda && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 text-xs font-medium leading-snug text-white">
                        {foto.legenda}
                      </figcaption>
                    )}
                  </div>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[18px] border border-dashed border-[var(--ink-faint)] bg-white p-10 text-center shadow-sm">
              <p className="numeral-watermark mx-auto text-5xl font-black text-[var(--ink)]/10">
                512
              </p>
              <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--ink-soft)]">
                As fotos das ações do capítulo aparecerão aqui assim que forem
                cadastradas pelo painel administrativo. Cada registro entra
                automaticamente neste mosaico.
              </p>
            </div>
          )}

          {fotos.length > 7 && (
            <p className="mt-6 text-center text-xs text-[var(--stone)]">
              Mostrando 7 de {fotos.length} registros · todos continuam no banco e
              podem ser exibidos com paginação futura.
            </p>
          )}
        </div>
      </section>

      {/* ========== APOIO – solene crimson-deep ========== */}
      <section className="relative overflow-hidden bg-[var(--crimson-deep)] text-[var(--paper)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_30%,rgba(201,162,39,0.08),transparent_60%)]"
        />
        <div
          aria-hidden
          className="numeral-watermark pointer-events-none absolute -right-10 bottom-0 select-none text-[28vw] font-black leading-none text-white/[0.03]"
        >
          512
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:py-18">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-light)]/90">
              Apoio
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight">
              Apoie o capítulo
            </h2>
            <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-white/75">
              O trabalho do Capítulo José Barreto de Albuquerque N°512 é mantido
              com o apoio de familiares, ex-membros e da comunidade. Se você
              quiser contribuir com nossas atividades, entre em contato com a
              diretoria.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--crimson-deep)] shadow-soft transition-all hover:bg-[var(--gold-light)]"
              >
                Entrar em contato
              </Link>
              <span className="inline-flex items-center gap-2 text-xs text-white/50">
                <span className="h-px w-6 bg-white/20" /> Resposta da diretoria em até 48h
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[18px] border border-[var(--gold)]/20 bg-[var(--paper)] p-6 text-[var(--ink)] shadow-strong">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)]">
                Como contribuir
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                Doações via PIX ajudam a manter materiais, eventos e ações sociais do capítulo. Copie a chave abaixo.
              </p>
              <div className="mt-5 rounded-[14px] border border-[var(--ink-faint)] bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]/50">Chave PIX (CPF)</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold tracking-wide text-[var(--crimson)]">087.376.533-85</p>
                    <p className="text-xs text-[var(--ink)]/60">Titular: Vitor dos Santos Correia</p>
                  </div>
                  <CopyPixButton pix="08737653385" />
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-[var(--ink)]/40">
                  Ao doar, envie o comprovante via WhatsApp da diretoria para confirmação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
