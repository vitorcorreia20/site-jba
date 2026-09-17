import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 4.5 * 1024 * 1024; // 4.5MB — limite Vercel Function payload
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/jpg",
]);

async function requireDiretoria() {
  const session = await getServerSession(authOptions);
  const papel = (session?.user as unknown as { papel?: string })?.papel;
  if (!session?.user) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  if (papel !== "DIRETORIA") return NextResponse.json({ erro: "Acesso restrito à diretoria" }, { status: 403 });
  return null;
}

function sanitizeFileName(name: string): string {
  // remove path, normaliza
  const base = name.split("/").pop()?.split("\\").pop() ?? "imagem";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "imagem";
}

export async function GET() {
  const guard = await requireDiretoria();
  if (guard) return guard;
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  const blobEnvs = Object.keys(process.env).filter((k) => k.includes("BLOB"));
  return NextResponse.json({
    hasToken,
    blobEnvs,
    hasStoreId: !!process.env.BLOB_STORE_ID,
    runtime: "nodejs",
    hint: hasToken
      ? "ok"
      : "BLOB_READ_WRITE_TOKEN ausente. Na Vercel: Storage > Blob Store > Connect Project + Redeploy sem cache. Local: vercel env pull ou copie para .env e reinicie next dev.",
  });
}

export async function POST(request: Request) {
  const guard = await requireDiretoria();
  if (guard) return guard;

  // Diagnóstico detalhado para Vercel: lista quais BLOB_* existem sem expor valores
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const blobEnvs = Object.keys(process.env).filter((k) => k.includes("BLOB"));
    return NextResponse.json(
      {
        erro: "BLOB_READ_WRITE_TOKEN não configurado no servidor. Crie o Blob Store na Vercel e conecte ao projeto.",
        detalhe:
          "Na Vercel: Storage > seu Blob Store > Settings > Connected Projects selecione site-jba em Production/Preview/Development, depois Deployments > Redeploy (sem cache). Local: rode `npx vercel env pull .env.local` e reinicie `npm run dev`.",
        diagnostico: {
          hasToken: false,
          blobEnvs,
          hasStoreId: !!process.env.BLOB_STORE_ID,
          vercel: !!process.env.VERCEL,
          vercelEnv: process.env.VERCEL_ENV || null,
        },
      },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ erro: "Formato inválido. Envie multipart/form-data com campo 'file'." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado. Use o campo 'file'." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { erro: `Tipo não permitido: ${file.type || "desconhecido"}. Use JPG, PNG, WEBP ou AVIF.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { erro: `Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 4.5MB.` },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ erro: "Arquivo vazio." }, { status: 400 });
  }

  const safeName = sanitizeFileName(file.name);
  const key = `site-jba/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  try {
    const blob = await put(key, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ erro: `Falha no upload para o Blob: ${msg}` }, { status: 500 });
  }
}
