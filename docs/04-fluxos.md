# 04 — Fluxos

## 1) Jovem quer fazer parte

```
Visitante --/quero-fazer-parte--> Form (FormularioAdmissao) --POST /api/admissoes--> SolicitacaoAdmissao PENDENTE
                                                            |
Painel /admin --GET /api/admin/solicitacoes--> lista PENDENTE ( comissão vê )
           --PATCH /api/admin/solicitacoes/[id]--> status EM_ANALISE (+ notasComissao)
                                                --> APROVADO / RECUSADO
```

* Campos: nome completo, `dataNascimento` (Date), `telefone` (WhatsApp, obrigatório), `cidade`, `email?` (legado, não exigido), `responsavel?` (se menor), `mensagem?` (motivação/como conheceu). Validação com `zod` em `app/api/admissoes/route.ts`.
* Sem e-mail automático — a comissão responde por WhatsApp/telefone, marca status e notas internas. A fila é a verdade, não a caixa de entrada.
* O jovem não precisa criar conta; o candidato é dado, não usuário.

## 2) Visitante entra em contato

```
/contato --POST /api/contato--> Contato {nome, telefone, descricao?}
Painel --GET /api/admin/contatos--> lista com filtros lido/realizado
       --PATCH /api/admin/contatos/[id]--> {lido, realizado}
```

* `lido` = já visto pela diretoria; `realizado` = já respondido/resolvido. Booleans separados permitem `lido && !realizado` (pendência).
* Não há e-mail — o telefone é a ponte.

## 3) Diretoria publica uma ação (o fluxo mais usado)

Este é o fluxo que alimenta a Home.

```
Painel Fotos --CampoUploadImagem--> /api/admin/upload (Vercel Blob) --> url Blob
            --ou cola URL externa (Cloudinary etc.)-->
            --preenche legenda? + dataRealizada dd/mm/yyyy (required)-->
            --POST /api/admin/fotos {url, legenda, dataRealizada}-->
            prisma.fotoAcao.create {dataRealizada: Date @ T12:00 para evitar shift UTC}
Home --prisma.fotoAcao.findMany orderBy dataRealizada desc--> HeroCarrossel slice(0,7) (interval 7s, setas hover) + mosaico 1+6
```

* **Data obrigatória:** UI exige `type="date"` (`components/admin/PainelFotos.tsx`), hint *“Se não informar, será usada hoje”*, mas bloqueia submit vazio. API faz `parseDataRealizada` (YYYY-MM-DD → `T12:00:00`) e fallback `new Date()` se vier vazio.
* **Edição:** `PATCH /api/admin/fotos/[id]` pode trocar `url/legenda/dataRealizada`; validação de URL e de data (`dd/mm/yyyy`).
* **Exclusão:** `DELETE /api/admin/fotos/[id]` só `DIRETORIA`; tenta `del()` no Blob se URL for `blob.vercel-storage.com` (best-effort).
* Ordenação é **sempre desc** — a foto mais recente no mundo vence, não a última a ser subida.

## 4) Gestão de membros e prêmios

```
Painel Membros --POST /api/admin/membros {idDemolay unique, nome, fotoUrl, tipo, cargoAtual, historicoCargos, premios[]}-->
              prisma.membro.create + createMany premios com ordem = índice
Painel --GET /api/admin/membros--> lista com premios orderBy ordem asc
Home --/ativos (ATIVO) /diretoria (DIRETORIA)--> raw.sort idDemolay numeric --> AtivosClient/ MemberCard
Clique card --> modal com histórico split("\n") + galeria premios
```

* `idDemolay` é a chave ordenadora pública — crescente, numérica. Não é PK, é identidade DeMolay.
* `historicoCargos` é texto livre multiline; renderizado com bolinhas douradas.
* Prêmios são imagens (`imagemUrl` Blob/externa + `legenda?` + `ordem`), nunca texto.

## 5) Linha do tempo de lideranças

```
Painel Liderancas --POST {nome, fotoUrl, periodo AAAA.S}--> ordem = parseGestao(periodo) (ano*10+semestre) --> MestreConselheiro
Painel --GET orderBy ordem asc--> mas app/lideranca reordena desc por parseGestao (mais nova no topo)
```

* `periodo` canônico `2026.1`/`2026.2`; legado `2023`/`2023/2024` ainda funciona com fallback `*10`. Erro de formato não trava, apenas cai para 0.

## 6) Dia a dia no Instagram e Apoio

* `InstagramSection` e `Footer` apontam para `https://www.instagram.com/cap_jba512` — não há feed embutido, é ponte editorial consciente.
* `Apoio` exibe `CopyPixButton` com chave Copia-e-Cola + titular; cópia é client-side, sem API.

---

Próximo: [Papéis e permissões →](./05-papeis-e-permissoes.md)
