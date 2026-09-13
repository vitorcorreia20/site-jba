import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminPanel from "@/components/admin/AdminPanel";
import BotaoSair from "@/components/admin/BotaoSair";

export const metadata = {
  title: "Painel admin | Capítulo José Barreto de Albuquerque N°512",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-azul">Painel admin</h1>
          <p className="text-sm text-grafite/60">
            Logado como {session?.user?.name ?? session?.user?.email}
          </p>
        </div>
        <BotaoSair />
      </div>

      <div className="mt-10">
        <AdminPanel />
      </div>
    </section>
  );
}
