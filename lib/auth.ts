import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "@/lib/auditoria";

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
      async authorize(credentials: Record<"email" | "senha", string> | undefined, req?: { headers?: Record<string, string | string[] | undefined> }) {
        if (!credentials?.email || !credentials?.senha) return null;

        const emailNormalizado = credentials.email.trim().toLowerCase();
        const fwd = req?.headers?.["x-forwarded-for"];
        const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim() || null;

        const usuario = await prisma.adminUser.findUnique({
          where: { email: emailNormalizado },
        });
        if (!usuario) {
          await registrarAuditoria({
            acao: "LOGIN_FALHA",
            entidade: "sessao",
            detalhe: `Tentativa com e-mail inexistente: ${emailNormalizado}`,
            ip,
          });
          return null;
        }

        const senhaValida = await bcrypt.compare(credentials.senha, usuario.senhaHash);
        if (!senhaValida) {
          await registrarAuditoria({
            acao: "LOGIN_FALHA",
            entidade: "sessao",
            detalhe: `Senha incorreta para ${usuario.email}`,
            atorId: usuario.id,
            atorNome: usuario.nome,
            atorEmail: usuario.email,
            ip,
          });
          return null;
        }

        await registrarAuditoria({
          acao: "LOGIN",
          entidade: "sessao",
          detalhe: `${usuario.nome} entrou no painel`,
          atorId: usuario.id,
          atorNome: usuario.nome,
          atorEmail: usuario.email,
          atorPapel: usuario.papel,
          ip,
        });

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
