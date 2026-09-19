import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Comissão só pode acessar solicitações; diretoria acessa tudo
    const token = req.nextauth.token as unknown as { papel?: string } | undefined;
    const papel = token?.papel;
    const pathname = req.nextUrl.pathname;

    // API: COMISSAO (GESTOR) só acessa solicitacoes e contatos; diretoria acessa tudo
    const allowedForComissao =
      pathname.startsWith("/api/admin/solicitacoes") || pathname.startsWith("/api/admin/contatos");
    if (pathname.startsWith("/api/admin/") && !allowedForComissao) {
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
      authorized: ({ token, req }) => {
        // libera /admin/login sempre
        if (req.nextUrl.pathname.startsWith("/admin/login")) return true;
        return !!token;
      },
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
