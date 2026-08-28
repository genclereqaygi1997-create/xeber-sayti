import { searchArticles } from "../../../lib/db";
import ArticleCard from "../../../components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  const results = q ? await searchArticles(q) : [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-2">Axtarış nəticələri</h1>
      <p className="text-ink/50 mb-8">
        <span className="font-semibold text-ink/70">&ldquo;{q}&rdquo;</span> üzrə{" "}
        {results.length} nəticə tapıldı.
      </p>

      {results.length ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-12 text-center text-ink/50">
          Heç bir nəticə tapılmadı.
        </div>
      )}
    </div>
  );
}
