# 02 — Arquitetura

## Stack escolhida e porquê

| Camada | Tecnologia | Por que aqui |
|---|---|---|
| **UI / SSR** | Next.js 14 App Router + TypeScript + React 18 | SSR + ISR com `revalidate = 60`, tipagem forte, ecossistema Vercel |
| **Estilo** | Tailwind CSS + CSS vars | Sistema editorial crimson/gold/paper sem lock-in, utilitário + vars narrativas |
| **Auth** | NextAuth 4 + `bcryptjs` | Login email/senha simples, sem OAuth externo, `PapelAdmin` no JWT |
| **Dados** | Prisma 5 + PostgreSQL (Neon/Vercel Postgres via `POSTGRES_PRISMA_URL`) | Modelo relacional claro, migrations versionadas, pooling |
| **Mídia** | Vercel Blob `@vercel/blob` + fallback URL externa | Upload direto no painel, sem servidor de arquivos próprio |
| **Hospedagem** | Vercel | Deploy git-push, envs e Postgres integrados, `vercel.json` estável |

`package.json:1` fixa tudo em versões estáveis; `postinstall: prisma generate` garante client sempre fresco.

## Mapa de rotas

```
app/
  page.tsx                 Home — hero + história + mosaico (ISR 60)
  lideranca/page.tsx       SSG/ISR — lista MestreConselheiro por periodo desc
  ativos/page.tsx          Ativos por idDemolay asc
  diretoria/page.tsx       Diretoria por idDemolay asc
  quero-fazer-parte/page.tsx  Form admissão (client)
  contato/page.tsx         Form contato (client)
  admin/
    page.tsx               Shell admin (protegido)
    login/page.tsx         Login NextAuth
  api/
    admissoes/route.ts     POST SolicitacaoAdmissao (público)
    contato/route.ts       POST Contato (público)
    admin/
      fotos/route.ts       GET/POST FotoAcao (auth)
      fotos/[id]/route.ts  PATCH/DELETE (auth; DELETE só DIRETORIA)
      membros/*, liderancas/*, solicitacoes/*, contatos/*, usuarios/*
      upload/route.ts      Proxy Vercel Blob
lib/
  prisma.ts                singleton PrismaClient
  auth.ts                  authOptions NextAuth (credentials + PapelAdmin)
  capitulo.ts              getIdadeCapitulo() desde 2002, getGestoes() = anos*2
middleware.ts              guarda /admin (exceto /admin/login), redirect se sem sessão
components/
  Header.tsx / Footer.tsx / Historia.tsx / InstagramSection.tsx / HeroCarrossel.tsx
  AtivosClient.tsx / AtivoCard.tsx / MemberCard.tsx
  admin/*                  PainelFotos, PainelMembros, PainelLiderancas, etc.
prisma/schema.prisma       fonte canônica do modelo
```

## Renderização

* Páginas públicas são **ISR**: `export const revalidate = 60` (`app/page.tsx:10`, `app/ativos/page.tsx:5` etc.). A cada 60s a próxima visita regenera, sem rebuild. Fotos novas sobem ao carrossel/mosaico sozinhas.
* `app/admin` e `app/api/*` são dinâmicos (`dynamic = 'force-dynamic'` nas fotos), sempre frescos.
* `HeroCarrossel` é `use client` — carrossel 7s vive no browser, mas recebe `fotos.slice(0,7)` já ordenadas do server por `dataRealizada desc`.

## Fluxo de dados

```
Browser --GET /--> Next SSR (prisma.fotoAcao.findMany orderBy dataRealizada desc)
       <--HTML ISR 60s + HeroCarrossel (interval 7s, pause on hover)--

Painel /admin --fetch /api/admin/fotos--> GET ordenado desc, POST com {url, legenda, dataRealizada}
       --upload--> /api/admin/upload --> Vercel Blob --> url retornada --> POST fotos
```

* Leitura pública não passa por API — vai direto ao Prisma no server component.
* Escrita sempre passa por API com `getServerSession(authOptions)`.

## Por que não mais camadas

* Sem ORM duplo, sem BFF extra, sem tRPC — Prisma no server component já resolve 90% das leituras.
* Imagens não são otimizadas via servidor próprio: `next/image` com domínio Blob liberado em `next.config.mjs`.

---

Próximo: [Modelo de dados →](./03-modelo-de-dados.md)
