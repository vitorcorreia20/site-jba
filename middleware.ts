import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Comissão só pode acessar solicitações; diretoria acessa tudo
    const token = req.nextauth.token as unknown as { papel?: string } | undefined;
    const papel = token?.papel;
    const pathname = req.nextUrl.pathname;

    // API: bloqueia COMISSAO em rotas não-solicitacoes
    if (pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/solicitacoes")) {
      if (papel === "COMISSAO") {
        return new NextResponse(JSON.stringify({ erro: "Acesso restrito à diretoria" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: ["/admin/((?!login).*)", "/api/admin/:path*"],
};
