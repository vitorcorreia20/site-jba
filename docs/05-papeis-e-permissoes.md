# 05 — Papéis e permissões

## Dois papéis, sem hierarquia confusa

`enum PapelAdmin { DIRETORIA, COMISSAO }` (`prisma/schema.prisma:11`, `lib/auth.ts`).

| Papel | Quem é | Pode criar/editar fotos, membros, lideranças, solicitações, contatos | Pode **excluir** fotos | Pode gerenciar usuários |
|---|---|---|---|---|
| **COMISSAO** | Comissão de admissão / gestor do dia a dia | sim | **não** — `403` | não |
| **DIRETORIA** | Administração | sim | **sim** | sim (criar/promover/remover `AdminUser`) |

A regra está codificada, não em manual:

* `app/api/admin/fotos/route.ts:GET/POST` → `requireAuth()` (qualquer logado).
* `app/api/admin/fotos/[id]/route.ts:PATCH` → `requireAuth()`; `DELETE` → `requireDiretoria()` (`papel !== "DIRETORIA"` → 403).
* `PainelFotos.tsx` espelha: botão `Remover` fica `disabled` + tooltip *“Apenas Administração pode excluir”* se `papel !== "DIRETORIA"`.

Outros domínios seguem o mesmo espírito: **comissão opera, diretoria decide**. Usuários são criados via `scripts/criar-admin.mjs` (hash `bcryptjs`) e geridos em `PainelUsuarios` (apenas diretoria vê).

## Auth em si

* `lib/auth.ts: authOptions` — NextAuth Credentials: `email + senha` vs `senhaHash`, retorna `session.user` com `papel`. `NEXTAUTH_SECRET` + `NEXTAUTH_URL` em env.
* `middleware.ts` — protege `/admin/*` exceto `/admin/login`; sem sessão → redirect login; sessão com `papel` passa.
* Sem OAuth, sem 2FA — proposital: time pequeno, rotação semestral, senha forte + Vercel env já basta. Auditoria é por `criadoEm`/`atualizadoEm`, não por log.

## O que não existe (de propósito)

* Não há `SUPER_ADMIN` — DIRETORIA já é teto.
* Não há convite por e-mail — usuário é criado localmente e senha é combinada fora do sistema.
* Não há permissão por recurso (ex. “só fotos”) — se você está no painel, pode manter a memória. A única porteira é exclusão.

## Em prática

* Um gestor novo recebe `COMISSAO` — publica fotos do mutirão do fim de semana, atualiza cargo do primo, responde contatos, mas não apaga o registro de 2015 por engano.
* Um tesoureiro da diretoria recebe `DIRETORIA` — além de tudo, apaga duplicata, cria novo usuário da próxima gestão e fecha a fila.

---

Próximo: [Design system →](./06-design-system.md)
