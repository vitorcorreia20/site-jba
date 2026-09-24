# 03 — Modelo de dados

Fonte canônica: `prisma/schema.prisma:1-109`. Cinco migrações em `prisma/migrations/` + `20260924000000_add_dataRealizada_remove_ordem`.

## Diagrama em palavras

```
AdminUser 1--* (lógico) --* Membro 1--* Premio
                \--* MestreConselheiro (isolado, histórico)
                \--* SolicitacaoAdmissao (fila admissão)
                \--* FotoAcao (mural Home)
                \--* Contato (inbox)
```

Não há FK entre AdminUser e o resto — RBAC é por papel, não por dono.

## Tabelas

### `AdminUser` — quem pode entrar em `/admin`
| campo | tipo | nota |
|---|---|---|
| `id` | `cuid` | PK |
| `nome`, `email` unique, `senhaHash` | string | `bcryptjs` |
| `papel` | `PapelAdmin` `DIRETORIA`/`COMISSAO` | decide quem apaga |
| `criadoEm` | DateTime | `now()` |

### `Membro` + `Premio`
`Membro` guarda **vivos e história** no mesmo lugar.

* `idDemolay` unique string (ordenação numérica via `localeCompare numeric` em `app/ativos/page.tsx:17`)
* `tipo` `ATIVO` / `DIRETORIA`, `ativo` boolean (desativa sem apagar), `fotoUrl?`, `cargoAtual?`, `historicoCargos?` (texto livre, 1 cargo por linha)
* `Premio` → `Membro` (Cascade, index `membroId`): `imagemUrl`, `legenda?`, `ordem Int` (ordem da galeria), `criadoEm`. `include premios orderBy ordem asc` em todos os fetches.

### `MestreConselheiro` — linha do tempo
* `nome`, `fotoUrl?`, `periodo String` formato canônico `AAAA.S` (`2026.1/2026.2`), `ordem Int` calculada via `parseGestao(periodo)` (`app/api/admin/liderancas/route.ts:48`), `criadoEm`. Ordenação pública: `parseGestao(b.periodo) - parseGestao(a.periodo)` (`app/lideranca/page.tsx:34`).

### `SolicitacaoAdmissao` — funil
* `nomeCompleto`, `dataNascimento DateTime`, `email?` (legado nullable, novos usam WhatsApp), `telefone` (WhatsApp c/ DDD, obrigatório), `responsavel?`, `cidade`, `mensagem?`, `status` `PENDENTE/EM_ANALISE/APROVADO/RECUSADO`, `notasComissao?`, timestamps. Fluxo via `PainelSolicitacoes`.

### `FotoAcao` — o mural (coração do site)
* `id`, `url`, `legenda?`, **`dataRealizada DateTime`**, `criadoEm`. 
* Desde `20260924000000`: `dataRealizada` substitui `ordem Int`. Backfill `dataRealizada = criadoEm`, `NOT NULL DEFAULT CURRENT_TIMESTAMP`. Toda leitura pública e admin usa `orderBy: { dataRealizada: "desc" }` — a ação mais recente no mundo fica no topo, não a última cadastrada. `HeroCarrossel` consome `slice(0,7)`. `dataRealizada` é **obrigatória** no `PainelFotos` (`dd/mm/yyyy`).

### `Contato` — inbox simples
* `nome`, `telefone`, `descricao?`, `lido Boolean`, `realizado Boolean`, `criadoEm`. Sem status enum — binário direto.

## Escolhas

* **String como datas de gestão** (`periodo`) em vez de FK — histórico raramente muda, leitura é ordenação, não join.
* **Texto livre em `historicoCargos`** — flexível para décadas de cargos sem migração.
* **Soft-delete via `ativo`** — preserva ID DeMolay e histórico sem quebrar listagens.
* **`dataRealizada` vs `criadoEm`** — `criadoEm` é auditoria técnica, `dataRealizada` é verdade editorial. O mosaico conta semestre de serviço, não clique no painel.

---

Próximo: [Fluxos →](./04-fluxos.md)
