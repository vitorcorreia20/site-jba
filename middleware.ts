export { default } from "next-auth/middleware";

export const config = {
  // Protege as páginas do painel (exceto o login) e as rotas de API do admin
  matcher: ["/admin/((?!login).*)", "/api/admin/:path*"],
};
