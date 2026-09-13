import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials: Record<"email" | "senha", string> | undefined) {
        if (!credentials?.email || !credentials?.senha) return null;

        const usuario = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });
        if (!usuario) return null;

        const senhaValida = await bcrypt.compare(
          credentials.senha,
          usuario.senhaHash
        );
        if (!senhaValida) return null;

        return { id: usuario.id, name: usuario.nome, email: usuario.email };
      },
    }),
  ],
};
