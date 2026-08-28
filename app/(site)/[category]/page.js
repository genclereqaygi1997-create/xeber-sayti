import { getByCategory } from "../../../lib/db";
import { categoryLabel, CATEGORIES } from "../../../data/categories";
import ArticleCard from "../../../components/ArticleCard";
import Pagination from "../../../components/Pagination";

const PAGE_SIZE = 9;

export async function generateMetadata({ params }) {
  const label = categoryLabel(params.category);
  const title = `${label} xəbərləri — XəbərPortal`;
  const description = `${label} bölməsi üzrə son xəbərlər, təhlillər və yeniliklər.`;
  return {
    title,
    description,
    alternates: { canonical: `/${params.category}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const all = await getByCategory(category);
  const known = CATEGORIES.some((c) => c.slug === category);

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, parseInt(searchParams?.page, 10) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const articles = all.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-brand-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            {categoryLabel(category)}
          </h1>
        </div>
        {all.length > 0 && (
          <span className="text-sm text-ink/40">{all.length} xəbər</span>
        )}
      </div>

      {!known && (
        <p className="text-sm text-ink/40 mb-6">
          Bu bölmə naviqasiyada tanınmır, lakin ünvana uyğun xəbərlər axtarılır.
        </p>
      )}

      {articles.length ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/${category}`} />
        </>
      ) : (
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-12 text-center">
          <p className="text-ink/50">Bu bölmədə hələ xəbər yoxdur.</p>
          <p className="text-ink/30 text-sm mt-1">
            Admin panelindən yeni xəbər əlavə edə bilərsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
