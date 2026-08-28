"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { categoryLabel } from "../../../../data/categories";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/articles");
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id, title) {
    if (!confirm(`"${title}" xəbərini silmək istədiyinizə əminsiniz?`)) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Bütün xəbərlər</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          + Yeni xəbər
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
        {loading ? (
          <p className="p-6 text-ink/40 text-sm">Yüklənir...</p>
        ) : articles.length ? (
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] text-ink/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Başlıq</th>
                <th className="text-left font-semibold px-5 py-3">Bölmə</th>
                <th className="text-left font-semibold px-5 py-3">Tarix</th>
                <th className="text-right font-semibold px-5 py-3">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3 max-w-xs">
                    <p className="font-medium text-ink truncate">{a.title}</p>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{categoryLabel(a.category)}</td>
                  <td className="px-5 py-3 text-ink/40">
                    {new Date(a.date).toLocaleDateString("az-AZ")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/${a.category}/${a.slug}`}
                        target="_blank"
                        title="Saytda gör"
                        className="p-2 rounded-lg hover:bg-black/5 text-ink/50"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link
                        href={`/admin/articles/${a.id}`}
                        title="Redaktə et"
                        className="p-2 rounded-lg hover:bg-black/5 text-ink/50"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        title="Sil"
                        className="p-2 rounded-lg hover:bg-accent-500/10 text-accent-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-ink/40 text-sm">Hələ heç bir xəbər yoxdur.</p>
        )}
      </div>
    </div>
  );
}
