import { getByCategory } from "../../../lib/db";
import { categoryLabel, CATEGORIES } from "../../../data/categories";
import ArticleCard from "../../../components/ArticleCard";

export function generateMetadata({ params }) {
  return { title: `${categoryLabel(params.category)} — XəbərPortal` };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const { category } = params;
  const articles = await getByCategory(category);
  const known = CATEGORIES.some((c) => c.slug === category);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <span className="h-6 w-1.5 rounded-full bg-brand-500" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
          {categoryLabel(category)}
        </h1>
      </div>

      {!known && (
        <p className="text-sm text-ink/40 mb-6">
          Bu bölmə naviqasiyada tanınmır, lakin ünvana uyğun xəbərlər axtarılır.
        </p>
      )}

      {articles.length ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
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
