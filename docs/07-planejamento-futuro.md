# 07 — Planejamento Futuro: Hub Central JBA 512

> **Status:** planejamento aprovado, sem implementação. Este documento é a fonte para a equipe transformar a vitrine atual em **plataforma central do capítulo** — com rede profissional classificada, acervo em PDF viewer e base para futuros sistemas. Vitrine continua pública e intacta.

## 1. Visão — por que este hub existe

O site em produção (`app/page.tsx`, ISR 60, carrossel 7s por `dataRealizada desc`) já cumpre seu papel de **vitrine extra**. A dor real do capítulo não é falta de site, é **continuidade**: DeMolays se desligam e se perdem, documentos moram em Drives/WhatsApps, cada gestão reinventa a roda. Se houver crise (perda de Drive, troca brusca de diretoria), nada restaura.

**Tese para a equipe:** este repositório vira **placa-mãe**. Mesmo monólito Next.js + Prisma + Postgres, mas com três responsabilidades novas, todas sob o mesmo banco/auth:

1. **Manter todo DeMolay permanentemente cadastrado** (não só ativos).
2. **Expor rede profissional buscável por área** para maçom empresário/simpatizante — sem expor telefone.
3. **Guardar acervo oficial com PDF viewer direto** — fora de Drive.
4. **Ser API canônica (`hub/v1`) para qualquer sistema futuro** (presença, tesouraria, eventos) — sem duplicar dados.

> Se um sistema futuro precisar de "quem são os membros ativos", ele lê `GET /api/hub/v1/membros?capitulo=jba512`, não cria outra tabela.

## 2. Fronteira público × privado (regra de ouro)

| Domínio | Público (sem login) | Privado (hub, só membros logados) |
|---|---|---|
| **Vitrine** `/` `/lideranca` `/ativos` `/diretoria` `/quero-fazer-parte` `/contato` + `InstagramSection` | **sim** — como hoje | — |
| **Rede profissional** `/profissionais` | **sim, 100% pública** — card resumido (foto, nome, área canônica + livre, cidade, bio 2 linhas, selo verificado), **sem telefone/WhatsApp** | **gestão + mediação** em `/hub/profissionais` (só diretoria/comissão) |
| **Acervo** `CARTA_CONSTITUTIVA` `OFICIO` `FICHA_SINDICANCIA` + futuros | **nunca** | **100% interno** — `/hub/acervo` com visibilidade |
| **Hub** `/hub` launcher + `/api/hub/v1/*` | não | **só DeMolay autenticado** |

Decisão explícita: documentos sensíveis (ficha de sindicância) nunca vazam; rede é vitrine de networking fraterno, não banco de currículos com telefone exposto.

## 3. Hub — seletor de rotas, rota padrão = site

**Rota padrão continua `/`** (vitrine). Hub é camada nova, não substitui.

```
/                → vitrine pública (sem auth, ISR)
/profissionais    → busca profissional 100% pública (sem login, filtrada por areaCanonica)
/hub             → launcher central (auth membro obrigatório)
// cards: [ Site Admin ] → /admin (hoje) re-montado como /hub/site-admin
//        [ Acervo ]     → /hub/acervo
//        [ Rede ]       → /hub/profissionais (gestão/verificação)
//        [ Futuros ]    → placeholders /hub/eventos, /hub/tesouraria...
/hub/acervo/*    → só com visibilidade compatível
/api/hub/v1/*    → API canônica para futuros sistemas (ApiKey + JWT membro)
```

* **Auth:** hoje `AdminUser{papel DIRETORIA/COMISSAO}` (`lib/auth.ts`, `middleware.ts:48` guarda `/admin`). Novo: `ContaMembro` (ou `Membro` com `email, senhaHash`) + segundo provider NextAuth `credentials-membro` com JWT `{tipo:"MEMBRO"|"ADMIN", capituloId:"jba512", membroId}`. `middleware.ts` passa a guardar `/hub/*` para `MEMBRO|ADMIN`, `/admin/*` só `ADMIN`. Login unificado em `/hub/login`.
* **UI:** `app/hub/page.tsx` + `components/HubLauncher.tsx` grid de apps, guardado. `Header` ganha link discreto `Área do membro → /hub`.

## 4. 12 Áreas canônicas — livre na entrada, organizada na busca

Aprovado: **12 áreas fechadas na busca, livres na digitação**.

| slug | Nome | Keywords seed (exemplos) |
|---|---|---|
| `TECNOLOGIA` | Tecnologia | ti, tecnologia, desenvolvedor, programador, backend, frontend, infra, dados, devops |
| `ENGENHARIA` | Engenharia | engenharia, engenheiro, civil, mecânica, elétrica, produção |
| `SAUDE` | Saúde | saúde, médico, enfermagem, fisioterapia, odontologia, psicologia |
| `JURIDICO` | Jurídico | jurídico, advogado, advocacia, direito, oab, promotor |
| `EDUCACAO` | Educação | educação, professor, pedagogo, licenciatura, escola |
| `COMERCIO_VENDAS` | Comércio/Vendas | comércio, vendas, varejo, representante, loja |
| `SERVICOS_GERAIS` | Serviços Gerais | serviços, pedreiro, eletricista, barbeiro, mecânico |
| `MARKETING_DESIGN` | Marketing/Design | marketing, design, publicidade, social media, criativo |
| `FINANCEIRO` | Financeiro | financeiro, contador, contabilidade, banco, finanças |
| `CONSTRUCAO` | Construção | construção, obra, arquitetura, mestre de obras |
| `TRANSPORTE` | Transporte | transporte, motorista, logística, entrega |
| `OUTROS` | Outros | fallback, flag `revisar` |

Seed em `AreaCanonica{slug,nome,keywords[]}`. DeMolay digita livre (`"Dev backend Node"`, `"adv civilista"`), sistema mapeia para canônica.

## 5. Classificador — como a bagunça vira ordem

**Pipeline no `POST/PATCH /api/hub/profissionais` (server):**

1. Concatena `areaLivre + bio + habilidades`.
2. Normaliza: `lower, sem acento (NFD), remove stopwords pt (de, da, e, com)`.
3. Tokeniza n-grams (1-2).
4. Casa com cada `AreaCanonica.keywords` → `score = matched / totalKeywordsDaArea`.
5. Se `score >= 0.35` → `areaCanonica = melhor`, `areaScore = score`; senão `OUTROS` + `revisar=true`.
6. Diretoria vê em `/hub/profissionais` a linha `Área livre → Canônica (score 0.52)` e pode corrigir manualmente (treina dicionário — adiciona keyword).

* **Busca:** filtros são por `areaCanonica`, não texto puro. Visitante digita "adv" → `contains "adv"` mapeia para `JURIDICO` → retorna todos `JURIDICO`. Mantém liberdade para quem se cadastra e ordem para quem busca.
* **MVP:** dicionário `contains/insensitive` + regex, sem ML. Se escalar para outros capítulos (>500 perfis), trocar por TF-IDF ou LLM leve sem mudar schema.
* **Índices:** `@@index([capituloId, areaCanonica])`, `@@index([capituloId, cidade])`.

## 6. Rede profissional 100% pública, contato mediado

* **Modelo:**
  ```prisma
  model PerfilProfissional {
    id String @id @default(cuid())
    membroId String @unique // 1:1 Membro.status != DESLIGADO
    capituloId String @default("jba512")
    areaLivre String // o que digitou
    areaCanonica String? // preenchida pelo classificador
    areaScore Float?
    titulo String? // ex "Advogado Jr."
    bio String? @db.Text
    habilidades String? // CSV livre por enquanto
    cidade String?; linkedin String?; portfolio String?
    disponivel Boolean @default(true)
    visivel Boolean @default(false) // LGPD consent
    consentidoEm DateTime?
    verificado Boolean @default(false) // diretoria valida ID DeMolay
    criadoEm @default(now()) atualizadoEm @updatedAt
    @@index([capituloId, visivel, verificado, areaCanonica])
  }
  model SolicitacaoContatoProfissional {
    id String @id @default(cuid())
    perfilId String // FK Perfil
    solicitanteNome String; solicitanteTelefone String; solicitanteEmail String?
    motivo String @db.Text
    status StatusContato @default(PENDENTE) // PENDENTE|EM_ANALISE|ENCAMINHADO|RECUSADO
    notasDiretoria String?; criadoEm @default(now())
  }
  ```
* **Fluxo:** alumni vira `ALUMNI` → convite *“Criar perfil profissional”* (form área livre + bio + cidade + consentimento *“Autorizo exibição de área/cidade/bio para networking”*) → `visivel=false` → diretoria verifica ID DeMolay + coerência → `verificado+visivel` → aparece em `/profissionais`.
* **Público vê:** `/profissionais?area=JURIDICO&cidade=São Paulo` lista cards resumidos com selo verificado, **sem telefone**. CTA `Solicitar contato via diretoria` → modal → `SolicitacaoContatoProfissional` → fila só em `/hub/profissionais` para diretoria mediar via WhatsApp fora do sistema (minimização LGPD).

## 7. Acervo — só interno, PDF abrindo direto no sistema

* **Tipos piloto (sensíveis):**
  ```prisma
  enum TipoDocumento { CARTA_CONSTITUTIVA, OFICIO, FICHA_SINDICANCIA, OUTRO }
  enum VisibilidadeDoc { DIRETORIA, COMISSAO, MEMBROS } // nunca PUBLICO para esses 3
  model Documento {
    id String @id @default(cuid())
    capituloId String @default("jba512")
    titulo String; tipo TipoDocumento; descricao String? @db.Text
    url String; tamanho Int; mime String; versao Int @default(1)
    visibilidade VisibilidadeDoc @default(DIRETORIA)
    pasta String? // "Oficios/2024" ou "Fichas/2026.1"
    enviadoPorId String // FK AdminUser
    tags String[]; criadoEm @default(now()) atualizadoEm @updatedAt
    @@index([capituloId, tipo, visibilidade])
  }
  model DocumentoAcessoLog { documentoId String; quemId String; quando DateTime; acao String } // download/view
  ```
* **Storage:** manter Vercel Blob para fotos, acervo usa R2/S3 (fichas >4.5MB), `url` presigned. `FICHA_SINDICANCIA` sempre `DIRETORIA` + audit obrigatório.
* **Viewer:** `/hub/acervo/[id]` com `<iframe src={url} />` ou `object` + `Content-Disposition: inline` + `mime=application/pdf` para abrir direto no navegador, sem download obrigatório. Download com log.
* **Fluxo:** `/hub/acervo` upload (tipo, pasta, tags, visibilidade) → aprovação DIRETORIA se `visibilidade=MEMBROS` → busca por pasta/tags/tipo → viewer inline.

## 8. Sistema como base central (vendável)

* **Tenant stub:** `model Capitulo { id String @id @default("jba512") nome String }` + `capituloId` em `Membro, Perfil, Documento, AdminUser/ContaMembro`. Hoje tudo `jba512`; vender = criar `capituloId` novo, isola dados, mesmo código.
* **API canônica:** `app/api/hub/v1/membros?capitulo=jba512&status=ATIVO`, `hub/perfis?areaCanonica=TECNOLOGIA`, `hub/documentos?tipo=OFICIO`. `X-Api-Key` + JWT membro. Docs em `docs/08-hub-api.md` futuro.
* **Membro lifecycle:** `enum StatusMembro { ATIVO, ALUMNI, SENIOR, DESLIGADO }` (`prisma/schema.prisma:32` hoje só `ATIVO/DIRETORIA` + `ativo boolean`). Migração: `ativo=true→ATIVO`, `ativo=false→ALUMNI`, manter `ativo` 1 release para compat. Painel `PainelMembros.tsx:255` ganha `Tornar alumni` + convite perfil.

## 9. Roadmap para equipe (sem tocar vitrine)

* **F0 Fundação (1 sprint):** migrations `StatusMembro`, `PerfilProfissional{areaLivre,areaCanonica,areaScore}`, `Capitulo` stub, `Documento` piloto + seed 12 áreas. Nenhuma UI pública muda.
* **F1 Classificador + Rede pública (1-2 sprints):** wizard perfil livre → canônica auto + tela revisão + `/profissionais` ILIKE canônica + `POST /api/profissionais/contato` mediado. **Done:** visitante sem login encontra `TECNOLOGIA` e solicita contato sem ver telefone.
* **F2 Hub + Auth Membro + Acervo PDF viewer (1-2 sprints):** `/hub` launcher + provider `credentials-membro` + `middleware` para `/hub/*` + `/hub/acervo` CRUD 3 tipos com R2 + viewer inline + log. Migra 1 carta + 1 ofício reais.
* **F3 Hub API (1 sprint):** `hub/v1` + `docs/08-hub-api.md` contrato. Pronto para vender: novo `capituloId` isolado.

## 10. Critérios de aceite

* Visitante em `/profissionais?area=adv` vê `JURIDICO` sem login, sem telefone, com selo verificado.
* Perfil livre `"pedreiro"` cai em `SERVICOS_GERAIS` com score >0.35 sem intervenção.
* PDF de `FICHA_SINDICANCIA` abre inline em `/hub/acervo/[id]` só para `DIRETORIA`, com log.
* Futuro app `presença` lê `GET /api/hub/v1/membros?capitulo=jba512` com ApiKey.

## 11. Riscos e contrapontos

* Área livre → falsos positivos → score + revisão + `OUTROS`.
* Ficha sensível → dupla checagem visibilidade + audit + R2 criptografado.
* Hub só membros → criar `ContaMembro` sem duplicar `AdminUser`; convite por e-mail para alumni.
* Blob 4.5MB → atas escaneadas estouram; R2 é quase obrigatório para acervo.

---

*Próximo passo prático:* F0. Vitrine segue intacta; hub nasce ao lado.
