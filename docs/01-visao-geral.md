# 01 — Visão geral

## O que é o JBA 512

O Capítulo José Barreto de Albuquerque Nº 512, da Ordem DeMolay, existe desde **2002**. Em 2026 são **23 anos** e **46 gestões semestrais** (`lib/capitulo.ts: getIdadeCapitulo / getGestoes`). Cada gestão é um semestre com um Mestre Conselheiro diferente à frente — a unidade de tempo do capítulo não é o ano, é a gestão.

O site é a **continuidade institucional** desse ritmo. Ele transforma cada semestre de serviço em registro público e cada interessado em um caminho claro até a comissão.

> “O JBA 512 não pertence somente a quem está aqui hoje.” — epígrafe da Home. Essa frase é a tese do sistema: memória > novidade.

## Para quem existe

* **Visitante casual e família** — quer entender valores (civismo, fraternidade, caráter) sem jargão maçônico excessivo. Encontra história editorial, números discretos e prova visual imediata (mosaico de ações).
* **Jovem 13–21 e responsável** — quer saber como entrar. Encontra `Quero fazer parte` com linguagem acolhedora, campos objetivos e retorno humano (não e-mail automático).
* **Família/apoiador** — quer contribuir. Encontra `Apoie o capítulo` com PIX Copia-e-Cola e selo de confiança.
* **Diretoria e Comissão de Admissão** — quer manter tudo atualizado sem depender de desenvolvedor. Encontra `/admin` com CRUD completo, responsivo, com papéis distintos.

## O que o sistema entrega (em linguagem humana)

### Casa aberta 24h
* **Home (`app/page.tsx`)** — Hero convite + carrossel hero (7 últimas fotos, troca a cada 7s, ordenadas por data real) → História editorial com `divider-diamond ◆` → Mosaico `Nossas ações` (1 destaque + 6) → Instagram `@cap_jba512` → Apoio.
* **Lideranças (`app/lideranca/page.tsx`)** — todos os Mestres Conselheiros, mais novos no topo (`periodo AAAA.S` desc). Foto 3/4, badge dourado.
* **Ativos (`app/ativos/page.tsx`)** — `Membro.tipo = ATIVO`, ordenados por ID DeMolay numérico crescente (`localeCompare numeric`), card com `#ID`, cargo dourado, foto e prêmios; modal com histórico linha a linha.
* **Diretoria (`app/diretoria/page.tsx`)** — mesmo padrão, `tipo = DIRETORIA`.

### Portas de entrada
* **Quero fazer parte (`app/quero-fazer-parte/page.tsx`)** — formulário `SolicitacaoAdmissao`: nome completo, nascimento, telefone/WhatsApp, cidade, responsável se menor, mensagem/motivação. Sem e-mail obrigatório (legado nullable).
* **Contato (`app/contato/page.tsx`)** — nome, telefone, descrição livre → `Contato` com `lido`/`realizado`.

### Cozinha que não aparece
* **/admin** — login NextAuth, painéis `PainelFotos`, `PainelMembros`, `PainelLiderancas`, `PainelSolicitacoes`, `PainelContatos`, `PainelUsuarios`. Tudo que o visitante vê nasce ali.

## O que o sistema não tenta ser

* Não é rede social — Instagram complementa, não substitui.
* Não é ERP — não gerencia financeiro além do PIX de apoio; não tenta ser secretaria completa.
* Não é blog — não há datas de postagem artificiais; a data que importa é `dataRealizada`, quando a ação aconteceu no mundo.

## Métricas que importam

* O capítulo tem **512** como âncora memorável — presente em watermark, lacre e numeral. Se um print circular sem logo, ainda é reconhecível.
* 23 anos são prova, não marketing. O contador é calculado (`lib/capitulo.ts`), não digitado.

---

Próximo: [Arquitetura →](./02-arquitetura.md)
