# Site do Capítulo José Barreto de Albuquerque N°512 (Ordem DeMolay)

Site institucional em **Next.js 14 + TypeScript**, com painel administrativo
e banco de dados, pronto para publicar na **Vercel**.

## O que o site tem

- **Home** — história do capítulo, galeria de fotos de ações, seção de apoio.
- **Quero fazer parte** — formulário de admissão; as respostas são salvas no
  banco e aparecem no painel admin para a comissão de análise avaliar.
- **Quadro de lideranças** — linha do tempo dos Mestres Conselheiros.
- **Quadro de ativos** — lista de membros ativos e seus cargos.
- **Diretoria** — cards com foto, cargo, histórico de cargos e prêmios.
- **/admin** — painel protegido por login para a diretoria gerenciar tudo
  acima sem mexer no código.

## 1. Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- Uma conta na [Vercel](https://vercel.com) (gratuita)

## 2. Instalar as dependências

```bash
npm install
```

## 3. Criar o banco de dados

O jeito mais simples é direto pelo painel da Vercel:

1. Crie um projeto na Vercel e importe este repositório (ou faça isso depois
   do primeiro deploy).
2. No projeto, vá em **Storage → Create Database → Postgres** (pode ser via
   Neon, integrado à Vercel).
3. Depois de criado, a Vercel oferece **"Connect Project"**, que já cria as
   variáveis `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` no projeto.
4. Copie essas duas variáveis para um arquivo `.env` local (copie
   `.env.example` para `.env` e preencha), para conseguir rodar localmente.

## 4. Gerar as tabelas do banco

```bash
npx prisma migrate dev --name inicial
```

Isso cria todas as tabelas (membros, lideranças, solicitações de admissão,
fotos, usuários admin) no banco configurado no `.env`.

## 5. Criar o primeiro usuário do painel admin

```bash
npm run criar-admin -- "Seu Nome" seuemail@exemplo.com "sua-senha-forte"
```

Guarde esse e-mail e senha — é o login de `/admin`.

## 6. Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`. O painel fica em
`http://localhost:3000/admin`.

## 7. Publicar na Vercel

```bash
npx vercel
```

ou conecte o repositório do GitHub direto pelo painel da Vercel. Depois do
primeiro deploy:

1. Confirme que as variáveis `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
   estão configuradas em **Settings → Environment Variables**.
2. Gere um `NEXTAUTH_SECRET` (`openssl rand -base64 32`) e adicione junto com
   `NEXTAUTH_URL` (a URL final do site, ex: `https://capitulo512.vercel.app`).
3. Rode as migrações contra o banco de produção:
   `npx prisma migrate deploy` (com o `.env` apontando pro banco de produção).
4. Crie o admin de produção com o mesmo comando do passo 5, apontando o
   `.env` para o banco de produção.

## Onde editar o conteúdo

- **História da Home**: texto direto em `app/page.tsx` (ou, futuramente,
  pode virar mais um campo editável pelo painel).
- **Fotos de ações, membros, lideranças, solicitações**: tudo pelo painel
  em `/admin`, sem precisar mexer no código.

## Estrutura do projeto

```
app/                    páginas (App Router)
  page.tsx              Home
  quero-fazer-parte/    formulário de admissão
  lideranca/            quadro de lideranças
  ativos/               quadro de ativos
  diretoria/            cards da diretoria
  admin/                painel administrativo (protegido por login)
  api/                  rotas de API (admissões + CRUD do admin)
components/             componentes de UI reutilizáveis
lib/                    Prisma Client e configuração de autenticação
prisma/schema.prisma    modelo do banco de dados
scripts/criar-admin.mjs script para criar o usuário do painel
```

## Próximos passos sugeridos

- Trocar as URLs de imagem por upload direto no painel (Vercel Blob).
- Adicionar um segundo campo de texto editável para a história da Home.
- Enviar um e-mail de aviso para a comissão quando chega uma nova solicitação.
