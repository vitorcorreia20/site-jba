"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/lideranca", label: "Quadro de lideranças" },
  { href: "/ativos", label: "Quadro de ativos" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  // impede que de scroll quando o menu do mobile tiver aberto e fecha se o uuusuário voltar para o tamanho normal
  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAberto]);
  useEffect(() => {
    const lidarComRedimensionamento = () => {
      if (window.innerWidth >= 1024 && menuAberto) {
        setMenuAberto(false);
      }
    };

    window.addEventListener("resize", lidarComRedimensionamento);
    return () =>
      window.removeEventListener("resize", lidarComRedimensionamento);
  }, [menuAberto]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gold-border)] bg-[var(--crimson)] text-[var(--paper)] shadow-sm">
      {/* hairline topo gold */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-6 lg:py-5">
        {/* Logo / Identidade */}
        <Link
          href="/"
          onClick={() => setMenuAberto(false)}
          className="group relative z-50 flex items-center gap-2.5 sm:gap-3"
          aria-label="Capítulo José Barreto de Albuquerque N°512 – página inicial"
        >
          {/* Brasão - Menor no mobile (h-9 w-9) e tamanho original no desktop (sm:h-11 sm:w-11) */}
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[var(--gold)] bg-[var(--crimson-deep)] shadow-sm transition-transform group-hover:scale-[1.02] sm:h-11 sm:w-11">
            <Image
              src="/logo-jba.png"
              alt="Brasão Capítulo José Barreto de Albuquerque N°512"
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
              priority
            />
          </span>

          {/* Texto do Capítulo - Quebra forçada de linha e tamanhos responsivos */}
          <span className="font-display text-[13.5px] font-semibold leading-[1.15] tracking-tight sm:text-[15px] lg:text-[17px]">
            Capítulo José Barreto
            <span className="block font-normal opacity-90">
              de Albuquerque N°512
            </span>
          </span>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative block py-2 text-[14px] font-medium tracking-wide text-[var(--paper)]/90 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--gold)] after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Botão de destaque restaurado para o Desktop */}
            <li className="ml-2">
              <Link
                href="/quero-fazer-parte"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-4 py-2 text-[13px] font-semibold text-[var(--crimson-deep)] shadow-sm transition-all hover:bg-[var(--gold-light)] hover:shadow-md hover:-translate-y-px"
              >
                Fazer parte
                <span aria-hidden className="text-[11px]">
                  →
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* BOTÃO MOBILE */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="relative z-50 p-1.5 text-[var(--gold-light)] transition-colors hover:text-white lg:hidden"
          aria-expanded={menuAberto}
          aria-label="Abrir menu de navegação"
        >
          <span className="sr-only">Menu</span>
          {menuAberto ? (
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        {/* MENU MOBILE FULL-SCREEN */}
        <div
          className={`fixed inset-0 z-40 flex h-[100dvh] w-full flex-col bg-[var(--crimson-deep)] px-6 pb-8 pt-24 transition-all duration-300 ease-in-out lg:hidden ${
            menuAberto
              ? "visible translate-x-0 opacity-100"
              : "invisible translate-x-full opacity-0"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(201,162,39,0.08),transparent_60%)]"
            aria-hidden
          />
          <div
            className="numeral-watermark pointer-events-none absolute -right-8 bottom-0 select-none text-[45vw] font-black leading-none text-white/[0.04]"
            aria-hidden
          >
            512
          </div>

          <nav className="relative z-10 flex flex-1 flex-col mt-4">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]/80">
              Navegação
            </p>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuAberto(false)}
                  className="font-display text-[19px] font-medium tracking-tight text-white/95 transition-colors hover:text-[var(--gold)]"
                >
                  Início
                </Link>
              </li>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuAberto(false)}
                    /* Tamanho reduzido para text-[19px] */
                    className="font-display text-[19px] font-medium tracking-tight text-white/95 transition-colors hover:text-[var(--gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-[var(--gold)]/20 pt-8">
              <Link
                href="/quero-fazer-parte"
                onClick={() => setMenuAberto(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3.5 text-[13.5px] font-bold text-[var(--crimson-deep)] shadow-strong transition-transform active:scale-[0.98]"
              >
                Quero fazer parte
                <span aria-hidden>→</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
