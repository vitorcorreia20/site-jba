# Capítulo José Barreto de Albuquerque Nº 512 — Ordem DeMolay

> **Formando jovens líderes através do civismo, da fraternidade e do caráter — há 23 anos e 46 gestões.**
> *N° 512 desde 2002. Cada semestre, um novo Mestre Conselheiro à frente.*

<p align="center">
  <a href="#-português">🇧🇷 Português</a> &nbsp;·&nbsp; <a href="#-english">🇺🇸 English</a> &nbsp;·&nbsp; <a href="./docs/">Docs →</a>
</p>

<p align="center">
  <sub>Editorial · solene · crimson & gold · watermark <strong>512</strong> como âncora memorável</sub>
</p>

---

## 🇧🇷 Português

### O que é

O site do **Capítulo José Barreto de Albuquerque Nº 512** é a casa digital de uma história que não pertence só a quem está aqui hoje. Nascido em 2002, o capítulo mantém viva a tradição DeMolay de formar caráter, liderança e serviço — gestão após gestão, sem interrupção.

Este não é um template institucional. É um arquivo vivo: cada foto de ação filantrópica, cada Mestre Conselheiro registrado, cada membro ativo listado é um semestre de serviço transformado em memória pública. O numeral **512** — em watermark gigante no hero, em lacre dourado, em selo tipográfico — é o fio que costura todas as páginas. Se você visse uma captura sem logo, ainda saberia que é o JBA.

### Para quem

| Quem você é | O que encontra | O que acontece depois |
|---|---|---|
| **Visitante / Família** | História editorial, mosaico de ações, quadros de honra | Entende o que significa ser DeMolay e confia |
| **Jovem 13–21 interessado** | `Quero fazer parte` com acolhimento direto | Sua solicitação chega à comissão, sem e-mail perdido |
| **Família que quer apoiar** | Seção `Apoie o capítulo` + PIX com cópia em 1 toque | Contribui com materiais, eventos e ações sociais |
| **Diretoria & Comissão** | `/admin` sem precisar de código | Publica fotos, membros, lideranças e responde em horas |

### A experiência

**Hero — um convite, não um banner.** À esquerda, a tipografia serifada conta `23 anos · 46 gestões semestrais · Capítulo Nº 512`. À direita, um carrossel editorial troca automaticamente a cada **7 segundos entre as 7 últimas atividades**, ordenadas pela **data em que a ação realmente aconteceu** (`dataRealizada desc`). Setas invisíveis nas laterais surgem só no hover — sem ruído, com intenção. Cada imagem carrega sua legenda como selo branco.

**História — solene, não nostálgica.** Bloco editorial com divider-losango `◆`, pull-quote *“O JBA 512 não pertence somente a quem está aqui hoje.”* e três números em destaque. Link discreto para o quadro completo de lideranças.

**Nossas ações — mosaico de serviço.** 1 destaque grande (8 cols × 2 linhas) + 6 secundárias, todas com `hover:scale`. Se houver mais de 7 registros, a mensagem *“Mostrando 7 de N”* lembra que o arquivo continua crescendo. Fotos vêm do painel, nunca do código.

**Quadros de honra.**

* **Lideranças (`/lideranca`)** — todos os Mestres Conselheiros, mais recentes no topo, ordenados por gestão `AAAA.S` (ex `2026.2 > 2026.1`). Foto 3/4, badge dourado de gestão.
* **Ativos (`/ativos`)** — membros `ATIVO` ordenados por ID DeMolay numérico crescente. Card mostra badge `#ID`, cargo dourado, foto e prêmios; clique abre cartão com histórico de cargos linha a linha.
* **Diretoria (`/diretoria`)** — mesma lógica, grid 3 cols com atenção tipográfica.

**Dia a dia no Instagram.** Seção espelho da Hero, mas clara: `@cap_jba512` com preview de feed, lista editorial e CTA para seguir — mantém o site vivo entre atualizações.

**Apoie.** Bloco `crimson-deep` com mesh dourada sutil. Chave PIX Copia-e-Cola + botão de cópia — doar não exige contato prévio.

### Jornadas que o sistema sustenta

1. **Querer fazer parte** — `Formulário de Admissão` em `/quero-fazer-parte` (nome, nascimento, telefone/WhatsApp, cidade, responsável se menor, motivação). Salva como `SolicitacaoAdmissao: PENDENTE` e aparece instantaneamente no painel da comissão (`EM_ANÁLISE → APROVADO/RECUSADO` com notas internas).
2. **Entrar em contato** — `/contato` (nome, telefone, descrição) → `Contato` com flags `lido`/`realizado` no painel.
3. **Manter a memória** — toda foto nova entra no topo do carrossel e do mosaico na Home sem deploy, porque a ordenação é por data real, não por ordem manual.

### O painel que mantém vivo — sem código

Em `/admin` (NextAuth, dois papéis):

* **Fotos de ação** — upload direto para Vercel Blob ou URL externa, legenda opcional, **data da atividade** obrigatória `dd/mm/yyyy` (fallback hoje, mas UI exige preenchimento). Ordenação automática por data, à prova de esquecimento.
* **Membros & Prêmios** — cria/edita `Membro` (ID DeMolay único, foto, `tipo ATIVO/DIRETORIA`, cargo atual, histórico livre, ativo/inativo) e galeria `Premio` ordenada.
* **Lideranças** — `MestreConselheiro` com período `AAAA.S` e cálculo automático de ordem.
* **Solicitações & Contatos** — filas com status, notas da comissão, marcação de lido/realizado.
* **Usuários** — gestão de `AdminUser` (`DIRETORIA` pode excluir; `COMISSAO` cria/edita).

O painel é responsivo (nível 2) e protegido por `middleware.ts` — sem login, sem acesso.

### Estética editorial

Inspirada em anuários institucionais, não em SaaS: **dominante crimson** (`--crimson`/`--crimson-deep`), **acento gold** (`--gold`/`--gold-light`), **neutro paper** (`--paper`/`--paper-2`). Uma serif display para títulos, uma sans contida para corpo. Mésh radial, watermark `512` a 3.5% de opacidade, divisores losango, sombras narrativas. Movimento escasso e com propósito: entradas `hero-in` e `hover:scale` apenas.

> *Isso evita UI genérica fazendo do número 512 um sistema visual — não um detalhe.*

### Tecnologia em uma linha

**Next.js 14 (App Router) + TypeScript · Prisma + PostgreSQL (Neon/Vercel Postgres) · NextAuth · Vercel Blob · Tailwind CSS** — hospedado na Vercel, dados e imagens fora do repositório, `revalidate = 60`.

### Créditos

Mantido pela diretoria do Capítulo José Barreto de Albuquerque Nº 512, Ordem DeMolay. Atualizado gestão após gestão.

<p align="center"><sub>Documentação completa → <a href="./docs/">docs/</a></sub></p>

---

## 🇺🇸 English

### What it is

The website of **Chapter José Barreto de Albuquerque No. 512** is the digital home of a history that does not belong only to those who are here today. Founded in 2002, the chapter keeps the DeMolay tradition of building character, leadership and service alive — term after term, without interruption.

This is not an institutional template. It is a living archive: every philanthropic action photo, every Master Councilor recorded, every active member listed is a semester of service turned into public memory. The numeral **512** — as a giant hero watermark, as a golden wax seal, as a typographic badge — stitches every page together. If you saw a screenshot without a logo, you'd still know it's JBA.

### Who it's for

| Who you are | What you find | What happens next |
|---|---|---|
| **Visitor / Family** | Editorial history, action mosaic, honor boards | Understands what being DeMolay means and trusts |
| **Prospective member 13–21** | `Join us` with direct, humane intake | Your application reaches the committee, no lost email |
| **Supporting family** | `Support the chapter` + 1-tap PIX copy | Funds materials, events and social actions |
| **Chapter Board & Committee** | `/admin` without touching code | Publishes photos, members, leaders and replies within hours |

### The experience

**Hero — an invitation, not a banner.** On the left, serif type tells `23 years · 46 semesters · Chapter No. 512`. On the right, an editorial carousel auto-rotates every **7 seconds through the 7 most recent activities**, ordered by the **actual date the activity happened** (`dataRealizada desc`). Invisible side arrows appear only on hover — no noise, with intent. Each image carries its caption as a white seal.

**History — solemn, not nostalgic.** Editorial block with diamond divider `◆`, pull-quote *"JBA 512 does not belong only to those here today."* and three numbers in focus. Subtle link to the full leadership board.

**Our actions — a service mosaic.** 1 large feature (8 cols × 2 rows) + 6 secondary, all with `hover:scale`. Beyond 7 records, *“Showing 7 of N”* reminds the archive keeps growing. Photos come from the panel, never from code.

**Honor boards.**

* **Leadership (`/lideranca`)** — all Master Councilors, newest first, ordered by term `YYYY.S` (e.g. `2026.2 > 2026.1`). 3/4 photo, golden term badge.
* **Active members (`/ativos`)** — `ATIVO` members ordered by numeric DeMolay ID ascending. Card shows `#ID` badge, golden role, photo and awards; tap opens full card with role history line by line.
* **Board (`/diretoria`)** — same logic, 3-col grid with typographic care.

**Daily life on Instagram.** Hero's mirror, but light: `@cap_jba512` with feed preview, editorial list and follow CTA — keeps the site alive between updates.

**Support.** `crimson-deep` block with subtle golden mesh. PIX Copy-and-Paste key + copy button — donating requires no prior contact.

### Journeys the system supports

1. **Want to join** — Admission form at `/quero-fazer-parte` (full name, birth date, phone/WhatsApp, city, guardian if minor, motivation). Saved as `SolicitacaoAdmissao: PENDENTE` and instantly visible in the committee panel (`EM_ANÁLISE → APROVADO/RECUSADO` with internal notes).
2. **Get in touch** — `/contato` (name, phone, description) → `Contato` with `lido`/`realizado` flags in the panel.
3. **Keep the memory alive** — every new photo enters the top of the hero carousel and mosaic on the Home without a deploy, because ordering is by real date, not manual order.

### The panel that keeps it alive — no code

At `/admin` (NextAuth, two roles):

* **Action photos** — direct upload to Vercel Blob or external URL, optional caption, **activity date** required `dd/mm/yyyy` (fallback today, but UI requires it). Auto-ordered by date, forget-proof.
* **Members & Awards** — create/edit `Membro` (unique DeMolay ID, photo, `tipo ATIVO/DIRETORIA`, current role, free-form history, active flag) and ordered `Premio` gallery.
* **Leadership** — `MestreConselheiro` with `periodo YYYY.S` and auto-calculated order.
* **Applications & Inbox** — queues with status, committee notes, read/done toggles.
* **Users** — `AdminUser` management (`DIRETORIA` can delete; `COMISSAO` can create/edit).

Responsive (level 2) and guarded by `middleware.ts` — no login, no access.

### Editorial aesthetic

Inspired by institutional yearbooks, not SaaS: **dominant crimson** (`--crimson`/`--crimson-deep`), **gold accent** (`--gold`/`--gold-light`), **paper neutrals** (`--paper`/`--paper-2`). One expressive serif for display, one restrained sans for body. Radial mesh, `512` watermark at 3.5% opacity, diamond dividers, narrative shadows. Sparse, purposeful motion: `hero-in` entrances and `hover:scale` only.

> *This avoids generic UI by turning the number 512 into a visual system — not a detail.*

### Tech in one line

**Next.js 14 (App Router) + TypeScript · Prisma + PostgreSQL (Neon/Vercel Postgres) · NextAuth · Vercel Blob · Tailwind CSS** — hosted on Vercel, data and images outside the repo, `revalidate = 60`.

### Credits

Maintained by the board of Chapter José Barreto de Albuquerque No. 512, Order of DeMolay. Updated term after term.

<p align="center"><sub>Full system docs → <a href="./docs/">docs/</a></sub></p>
