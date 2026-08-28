import { searchArticles } from "../../../lib/db";
import ArticleCard from "../../../components/ArticleCard";
import Pagination from "../../../components/Pagination";

const PAGE_SIZE = 9;

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }) {
  const q = searchParams?.q || "";
  return {
    title: q ? `"${q}" üçün axtarış nəticələri — XəbərPortal` : "Axtarış — XəbərPortal",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  const all = q ? await searchArticles(q) : [];

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, parseInt(searchParams?.page, 10) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const results = all.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-2">Axtarış nəticələri</h1>
      <p className="text-ink/50 mb-8">
        <span className="font-semibold text-ink/70">&ldquo;{q}&rdquo;</span> üzrə{" "}
        {all.length} nəticə tapıldı.
      </p>

      {results.length ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/axtaris?q=${encodeURIComponent(q)}`}
          />
        </>
      ) : (
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-12 text-center text-ink/50">
          Heç bir nəticə tapılmadı.
        </div>
      )}
    </div>
  );
}
