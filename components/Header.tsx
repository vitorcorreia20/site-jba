import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/lideranca", label: "Quadro de lideranças" },
  { href: "/ativos", label: "Quadro de ativos" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gold-border)] bg-[var(--crimson)] text-[var(--paper)] shadow-sm">
      {/* hairline topo gold */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:py-5">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Capítulo José Barreto de Albuquerque N°512 – página inicial"
        >
          {/* Logo do capítulo — substitui selo 512 tipográfico */}
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[var(--gold)] bg-[var(--crimson-deep)] shadow-sm transition-transform group-hover:scale-[1.02]">
            <Image
              src="/logo-jba.png"
              alt="Brasão Capítulo José Barreto de Albuquerque N°512"
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
              priority
            />
          </span>

          <span className="font-display text-[17px] font-semibold leading-[1.05] tracking-tight">
            Capítulo José Barreto
            <br />
            <span className="font-normal opacity-90">de Albuquerque N°512</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap items-center gap-1 text-[13px] font-medium tracking-wide">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative block px-3 py-2 text-[var(--paper)]/90 transition-colors hover:text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--gold)] after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* CTA isolado visualmente */}
            <li className="ml-2 hidden sm:block">
              <Link
                href="/quero-fazer-parte"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-4 py-2 text-[13px] font-semibold text-[var(--crimson-deep)] shadow-sm transition-all hover:bg-[var(--gold-light)] hover:shadow-md hover:-translate-y-px"
              >
                Fazer parte
                <span aria-hidden className="text-[11px]">→</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
