// Cria (ou atualiza a senha de) o usuário do painel admin.
// Uso: node scripts/criar-admin.mjs "Nome" email@exemplo.com "senha123" [DIRETORIA|COMISSAO]

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";

// Carrega .env manualmente se as variáveis do Prisma ainda não estiverem definidas
if (!process.env.POSTGRES_PRISMA_URL && fs.existsSync(".env")) {
  const linhas = fs.readFileSync(".env", "utf8").split("\n");
  for (const linha of linhas) {
    const trimmed = linha.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const chave = trimmed.slice(0, idx).trim();
    let valor = trimmed.slice(idx + 1).trim();
    if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
      valor = valor.slice(1, -1);
    }
    if (!process.env[chave]) process.env[chave] = valor;
  }
}

const [, , nome, emailRaw, senha, papelRaw] = process.argv;

if (!nome || !emailRaw || !senha) {
  console.error('Uso: node scripts/criar-admin.mjs "Nome" email@exemplo.com "senha" [DIRETORIA|COMISSAO]');
  process.exit(1);
}

const email = emailRaw.trim().toLowerCase();
let papel = "COMISSAO";
if (papelRaw) {
  const p = papelRaw.trim().toUpperCase();
  if (p === "DIRETORIA" || p === "COMISSAO") papel = p;
  else {
    console.error('Papel deve ser DIRETORIA ou COMISSAO');
    process.exit(1);
  }
}

const prisma = new PrismaClient();

const senhaHash = await bcrypt.hash(senha, 10);

const usuario = await prisma.adminUser.upsert({
  where: { email },
  update: { senhaHash, nome, papel },
  create: { nome, email, senhaHash, papel },
});

console.log(`Usuário admin pronto: ${usuario.email} [${usuario.papel}]`);
await prisma.$disconnect();
