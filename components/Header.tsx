import Link from "next/link";

const links = [
  { href: "/quero-fazer-parte", label: "Quero fazer parte" },
  { href: "/lideranca", label: "Quadro de lideranças" },
  { href: "/ativos", label: "Quadro de ativos" },
  { href: "/diretoria", label: "Diretoria" },
];

export default function Header() {
  return (
    <header className="bg-vermelho-escuro text-papel border-b border-dourado/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dourado text-dourado font-display text-lg"
          >
            512
          </span>
          <span className="font-display text-lg leading-tight">
            Capítulo José Barreto
            <br />
            de Albuquerque N°512
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap gap-1 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded px-3 py-2 transition-colors hover:bg-vermelho-claro"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
