import Link from "next/link";
import { Newspaper, PlusCircle, LayoutGrid, Database, AlertTriangle } from "lucide-react";
import { getAllArticles, isUsingDatabase } from "../../../lib/db";
import { PRIMARY_CATEGORIES, categoryLabel } from "../../../data/categories";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const articles = await getAllArticles();
  const byCategory = PRIMARY_CATEGORIES.map((c) => ({
    ...c,
    count: articles.filter((a) => a.category === c.slug).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">İdarəetmə paneli</h1>
      <p className="text-ink/50 mt-1">Xəbər portalının ümumi statistikası</p>

      <div
        className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
          isUsingDatabase
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {isUsingDatabase ? <Database size={16} /> : <AlertTriangle size={16} />}
        {isUsingDatabase
          ? "Postgres bazasına qoşulub — xəbərlər daimi saxlanılır."
          : "Baza qoşulmayıb — xəbərlər müvəqqəti fayl rejimində saxlanılır (bax README.md)."}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mt-6">
        <StatCard icon={Newspaper} label="Ümumi xəbər sayı" value={articles.length} />
        <StatCard
          icon={LayoutGrid}
          label="Aktiv bölmə sayı"
          value={byCategory.filter((c) => c.count > 0).length}
        />
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-3 rounded-2xl bg-brand-500 hover:bg-brand-600 transition-colors text-white p-5"
        >
          <PlusCircle size={26} />
          <div>
            <p className="font-bold">Yeni xəbər əlavə et</p>
            <p className="text-sm text-white/80">Sürətli əlavə et</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 bg-white rounded-2xl ring-1 ring-black/5 p-6">
        <h2 className="font-bold text-ink mb-4">Bölmələr üzrə paylanma</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {byCategory.map((c) => (
            <div
              key={c.slug}
              className="flex items-center justify-between rounded-lg border border-black/5 px-4 py-3"
            >
              <span className="text-sm font-medium text-ink/70">
                {categoryLabel(c.slug)}
              </span>
              <span className="text-sm font-bold text-brand-600">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl ring-1 ring-black/5 p-6">
        <h2 className="font-bold text-ink mb-4">Son əlavə edilən xəbərlər</h2>
        <div className="flex flex-col divide-y divide-black/5">
          {articles.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}`}
              className="py-3 flex items-center justify-between hover:text-brand-600"
            >
              <span className="text-sm font-medium truncate pr-4">{a.title}</span>
              <span className="text-xs text-ink/40 shrink-0">
                {categoryLabel(a.category)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-ink">{value}</p>
        <p className="text-sm text-ink/50">{label}</p>
      </div>
    </div>
  );
}
