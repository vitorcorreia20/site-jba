# Documentação — Site JBA 512

> Navegue a memória, a arquitetura e as regras do Capítulo José Barreto de Albuquerque Nº 512.
> *Se o `README.md` é o convite, isto é o mapa.*

Esta pasta guarda **o que o sistema é e como ele pensa**, sem tutorial de instalação — o site já está em produção na Vercel.

## Como usar esta documentação

Leia na ordem para entender o todo, ou salte direto ao que precisa:

| # | Arquivo | O que responde | Para quem |
|---|---|---|---|
| 01 | [Visão geral](./01-visao-geral.md) | O que é o JBA 512, para quem serve, mapa de páginas | Todos — diretoria, comissão, novos colaboradores |
| 02 | [Arquitetura](./02-arquitetura.md) | Como o Next.js 14, Prisma e Vercel se encaixam, por que `revalidate = 60` | Devs, quem vai evoluir o código |
| 03 | [Modelo de dados](./03-modelo-de-dados.md) | Tabelas, relações, por que `dataRealizada desc` no topo | Devs, quem alimenta o painel |
| 04 | [Fluxos](./04-fluxos.md) | Passo a passo de admissão, contato e publicação de fotos | Diretoria/comissão no dia a dia |
| 05 | [Papéis e permissões](./05-papeis-e-permissoes.md) | `DIRETORIA` vs `COMISSAO`, o que cada um pode fazer | Quem gerencia usuários |
| 06 | [Design system](./06-design-system.md) | Paleta crimson/gold/paper, tipografia, 512 como sistema visual | Designers e devs de front |

## Convenções

* **Linguagem:** PT-BR nos docs (README raiz é bilíngue).
* **Fonte de verdade:** `prisma/schema.prisma` para dados, `app/*` para rotas, `components/admin/*` para painel.
* **Data como verdade:** toda foto é ordenada por `dataRealizada` — a data em que a ação aconteceu, não quando foi cadastrada.
* **Sem setup:** não há `npm install` aqui por escolha. Em caso de manutenção, fale com a diretoria técnica.

## Onde tudo vive (atalho)

```
app/page.tsx              Home — hero + carrossel 7s + mosaico
app/lideranca/page.tsx    Mestres Conselheiros (ordem AAAA.S)
app/ativos/page.tsx       Membros ATIVO (ID DeMolay crescente)
app/diretoria/page.tsx    Membros DIRETORIA
app/quero-fazer-parte/    Formulário SolicitacaoAdmissao
app/contato/              Formulário Contato
app/admin/                Painel — PainelFotos / Membros / Liderancas / Solicitacoes / Contatos / Usuarios
prisma/schema.prisma      Modelo canônico do banco
lib/capitulo.ts           Idade/gestões desde 2002
```

---

*512 é número, memória e moldura. O resto é consequência.*
