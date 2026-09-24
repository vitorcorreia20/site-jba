# 06 — Design system

> Skill guia: `SKILL/skill-front.md`. Tese: **editorial solene, não SaaS**. Se tirarmos o logo, o 512 ainda entrega.

## Tese estética

**Nome:** *Institutional editorial / yearbook*. Cruza anuário de capítulo com revista institucional: serifas grandes que seguram o olhar, ouro contido, crimson como peso, paper como respiro. Nada de gradiente roxo em fundo branco, nada de card genérico com sombra média.

**DFII auto-avaliação:** Impacto 5 + Fit 5 + Feasibility 4 + Performance 4 − Risk 2 = **16** (Excelente). O risco de inconsistência é baixo porque o sistema é pequeno e as vars travam a paleta.

## Paleta — uma história, não um arco-íris

Dominante **crimson** (poder, solenidade), acento **gold** (honra, tempo), neutro **paper** (leitura). Tudo via CSS vars em `tailwind.config.ts` / `app/layout.tsx`:

```css
--crimson: #7A0C1A;
--crimson-deep: #4F0810;
--gold: #C9A227;
--gold-light: #E8D9A0;
--gold-faint: rgba(201,162,39,.08);
--paper: #FDFBF7;
--paper-2: #F5F1E8;
--ink: #1A1A1A;
--ink-soft: #5A5A5A;
--stone: #8A8A8A;
```

* Proporção: ~70% paper, 20% crimson, 10% gold. Gold nunca como fundo cheio — é linha, selo, divider, foco.
* Nunca gold sobre crimson sem `gold-light` — garante contraste.

## Tipografia — duas vozes, sem ruído

* **Display:** serif com presença (ex. fração `5vw` em `app/page.tsx:45`, `font-display`, tracking-tight). Usada para `Capítulo José Barreto de Albuquerque Nº512` e `Mestres Conselheiros 23 anos, 46 gestões`. Estrutura, não decoração.
* **Body:** sans contida, `text-[14px] leading-relaxed text-[var(--ink-soft)]`, sempre `max-w-prose`.
* Regra: system/Inter/Roboto proibidos (SKILL Anti-Patterns). Escala rítmica via `clamp()`.

## Composição — assimetria com intenção

* Grid 12 cols, mas hero é **7/5** (texto / carrossel) com `gap-8`, não 6/6. História também 7/5. Quebra previsível.
* **Overlap narrativo:** `.numeral-watermark` 512 gigante `42vw` a 3.5% (`app/page.tsx:33`), `mesh radial` em crimson (`30% 20%`), `losango` rotacionado `45deg` em gold (`-right-3 -top-3`), `selo 512` flutuante `-bottom-4 -left-3`. Cada um está num canto diferente — densidade controlada.
* **Espaço como elemento:** `rounded-t-[28px]` na história sobrepõe o hero (`-mt-6`), criando folga solene, não corte seco.
* **Bordas com significado:** `border --gold/25` no carrossel, `border-l-2 --gold` no pull-quote, `divider-diamond ◆` em todas as seções. Borda é honra, não contorno.

## Movimento — pouco, forte

* Filosofia: CSS-first, uma entrada `hero-in` por seção, `hover:scale-[1.03]` nas fotos, `transition 700ms` no carrossel. Sem spam de micro-movimento.
* `HeroCarrossel` (`components/HeroCarrossel.tsx`): `setInterval 7000`, `pause on hover/focus`, arrows `opacity-0 → group-hover:opacity-100` (invisíveis por padrão, como pedido), dots `w-6 vs w-1.5`, `prefers-reduced-motion` implícito (sem animação agressiva).
* Mosaico: `auto-rows-[176px]` + `group-hover:scale` — o destaque `md:col-span-8 md:row-span-2` cresce, as outras acompanham.

## Textura & profundidade

* Grain não literal — `radial-gradient` duplo, `backdrop-blur` no hero CTA, `shadow-soft/strong` com intenção narrativa (carrossel `shadow-strong`, cards `shadow-soft`).
* `rounded-[14px]–[18px]` consistente — o 512 nunca fica quadrado.

## O que evita UI genérica

> **Em vez de** grid simétrico SaaS com cards brancos e CTA roxo, **fazemos** um número gigante 512 como sistema visual: watermark, lacre, badge, losango. O capítulo tem número, não só nome — o design lembra disso a cada dobra.

## Checklist rápido (SKILL)

* [x] Direção estética nomeada (editorial solene)
* [x] DFII ≥ 8
* [x] Âncora memorável (512)
* [x] Sem fontes/paleta genérica
* [x] Código espelha ambição (vars exclusivas, sem estilos mortos)
* [x] Acessível: contraste crimson/white, foco visível, `alt` em todas as fotos, `aria-live` no carrossel

---

Voltar ao [índice](./README.md) · Topo [README raiz](../README.md)
