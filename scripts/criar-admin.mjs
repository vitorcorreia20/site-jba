// Cria (ou atualiza a senha de) o primeiro usuário do painel admin.
// Uso: node scripts/criar-admin.mjs "Nome" email@exemplo.com "senha123"

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const [, , nome, email, senha] = process.argv;

if (!nome || !email || !senha) {
  console.error(
    'Uso: node scripts/criar-admin.mjs "Nome" email@exemplo.com "senha"'
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const senhaHash = await bcrypt.hash(senha, 10);

const usuario = await prisma.adminUser.upsert({
  where: { email },
  update: { senhaHash, nome },
  create: { nome, email, senhaHash },
});

console.log(`Usuário admin pronto: ${usuario.email}`);
await prisma.$disconnect();
