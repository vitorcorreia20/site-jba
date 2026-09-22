import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminPanel from "@/components/admin/AdminPanel";
import BotaoSair from "@/components/admin/BotaoSair";

export const metadata = {
  title: "Painel admin | Capítulo José Barreto de Albuquerque N°512",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login?callbackUrl=/admin");
  }
  const papel = (session.user as unknown as { papel?: string })?.papel ?? "COMISSAO";
  const isDiretoria = papel === "DIRETORIA";

  return (
    <div className="bg-[var(--paper)]">
      <section className="border-b border-[var(--gold-border)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:gap-4 sm:px-6 sm:py-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/30 bg-[var(--crimson-deep)] font-display text-xs font-bold text-[var(--gold)]">
                512
              </span>
              <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--crimson)] sm:text-2xl">
                Painel admin
              </h1>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  isDiretoria
                    ? "bg-[var(--crimson)] text-white"
                    : "bg-[var(--gold-faint)] text-[var(--crimson)] border border-[var(--gold-border)]"
                }`}
              >
                {isDiretoria ? "Administração" : "Gestor"}
              </span>
            </div>
            <p className="mt-2 truncate text-sm text-[var(--ink)]/60">
              Logado como <span className="font-medium text-[var(--ink)]">{session?.user?.name ?? session?.user?.email}</span>
            </p>
          </div>
          <BotaoSair />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-[18px] border border-[var(--ink-faint)] bg-white p-4 shadow-soft sm:p-6 lg:p-8">
          <AdminPanel papel={papel as "DIRETORIA" | "COMISSAO"} emailAtual={session.user?.email ?? undefined} />
        </div>
      </section>
    </div>
  );
}
