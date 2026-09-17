"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  id?: string;
  name?: string;
};

const MAX_BYTES = 4.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];

export default function CampoUploadImagem({
  label,
  value,
  onChange,
  placeholder = "https://... ou selecione um arquivo",
  required = false,
  hint,
  id,
  name,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErro(`Tipo não permitido: ${file.type || "desconhecido"}. Use JPG, PNG, WEBP ou AVIF.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setErro(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 4.5MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const resp = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await resp.json();
      if (!resp.ok) {
        setErro(json.erro || "Falha no upload.");
        return;
      }
      onChange(json.url);
    } catch {
      setErro("Erro de rede no upload.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)]">
        {label} {required && "*"}
      </label>
      {hint && <p className="mt-1 text-xs leading-relaxed text-[var(--ink)]/50">{hint}</p>}

      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => {
            setErro(null);
            onChange(e.target.value);
          }}
          required={required && !value}
          placeholder={placeholder}
          className="flex-1 rounded-[12px] border border-[var(--ink-faint)] bg-white px-3 py-2.5 text-sm placeholder:text-[var(--ink)]/30 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-faint)]"
        />
        <label
          className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${
            uploading
              ? "border-[var(--ink-faint)] bg-[var(--paper-2)] text-[var(--ink)]/40 cursor-wait"
              : "border-[var(--crimson)]/15 bg-white text-[var(--crimson)] hover:bg-[var(--crimson)] hover:text-white"
          }`}
        >
          {uploading ? "Enviando..." : "Escolher arquivo"}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {erro && <p className="mt-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}
      {uploading && <p className="mt-1 text-xs text-[var(--ink)]/40">Enviando para Vercel Blob...</p>}

      {value && (
        <div className="mt-2 overflow-hidden rounded-[12px] border border-[var(--ink-faint)] bg-[var(--paper-2)]">
          <div className="relative flex items-center justify-center bg-[var(--paper-2)] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="max-h-40 w-auto rounded-[8px] object-contain"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
