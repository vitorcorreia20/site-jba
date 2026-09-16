import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { papel?: string };
        if (u.papel) token.papel = u.papel;
        // não consultar Prisma em edge – papel já vem do authorize e fica no JWT
      }
      // mantém papel do token; tokens antigos sem papel exigirão novo login
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.papel) {
        (session.user as unknown as Record<string, unknown>).papel = token.papel;
      }
      return session;
    },
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

        const emailNormalizado = credentials.email.trim().toLowerCase();

        const usuario = await prisma.adminUser.findUnique({
          where: { email: emailNormalizado },
        });
        if (!usuario) return null;

        const senhaValida = await bcrypt.compare(credentials.senha, usuario.senhaHash);
        if (!senhaValida) return null;

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
        } as unknown as { id: string; name: string; email: string };
      },
    }),
  ],
};
