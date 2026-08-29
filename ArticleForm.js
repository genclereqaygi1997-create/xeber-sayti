"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { CATEGORIES } from "../data/categories";

export default function ArticleForm({ initial, articleId }) {
  const router = useRouter();
  const isEdit = !!articleId;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category || "son-xeber",
    excerpt: initial?.excerpt || "",
    image: initial?.image || "",
    author: initial?.author || "",
    content: initial?.content || "",
    featured: initial?.featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Şəkil yüklənmədi.");
        return;
      }
      update("image", data.url);
    } catch {
      setUploadError("Şəkil yüklənmədi. İnternet bağlantısını yoxlayın.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/articles/${articleId}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Xəta baş verdi.");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <Field label="Başlıq" required>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="input"
          placeholder="Xəbərin başlığını daxil edin"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Bölmə" required>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Müəllif">
          <input
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="input"
            placeholder="Redaksiya"
          />
        </Field>
      </div>

      <Field label="Qısa xülasə (kartlarda görünür)">
        <textarea
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={2}
          className="input resize-none"
          placeholder="1-2 cümlədən ibarət qısa məzmun"
        />
      </Field>

      <Field label="Şəkil">
        <div className="flex flex-col gap-3">
          {form.image && (
            <div className="relative w-full max-w-xs">
              <img
                src={form.image}
                alt="Önbaxış"
                className="w-full aspect-video object-cover rounded-lg ring-1 ring-black/10"
              />
              <button
                type="button"
                onClick={() => update("image", "")}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-ink text-white flex items-center justify-center shadow"
                title="Şəkli sil"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg border border-black/10 hover:bg-black/5 text-sm font-medium px-4 py-2 transition-colors disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {uploading ? "Yüklənir..." : "Kompüterdən şəkil seç"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs text-ink/40">və ya aşağıya birbaşa link yapışdırın</span>
          </div>

          <input
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            className="input"
            placeholder="https://..."
          />

          {uploadError && (
            <p className="text-xs text-accent-500 bg-accent-500/10 rounded-lg px-3 py-2">
              {uploadError}
            </p>
          )}
        </div>
      </Field>

      <Field label="Xəbərin mətni" required>
        <textarea
          required
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          rows={10}
          className="input resize-y"
          placeholder="Xəbərin tam mətni. Paraqrafları boş sətirlə ayırın."
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="h-4 w-4 rounded border-black/20 text-brand-500 focus:ring-brand-400"
        />
        Ana səhifədə önə çıxarılsın (hero bölməsi)
      </label>

      {error && (
        <p className="text-sm text-accent-500 bg-accent-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 transition-colors disabled:opacity-60"
        >
          {saving ? "Yadda saxlanılır..." : isEdit ? "Yadda saxla" : "Dərc et"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-black/10 text-ink/60 hover:bg-black/5 font-medium px-5 py-2.5 transition-colors"
        >
          Ləğv et
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.9rem;
          outline: none;
          background: white;
        }
        .input:focus {
          box-shadow: 0 0 0 2px #5b8bff;
        }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink/70">
        {label} {required && <span className="text-accent-500">*</span>}
      </span>
      {children}
    </label>
  );
}
