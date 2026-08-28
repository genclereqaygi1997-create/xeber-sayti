import Image from "next/image";
import { notFound } from "next/navigation";
import { getBySlug, getByCategory } from "../../../../lib/db";
import { categoryLabel } from "../../../../data/categories";
import ArticleCard, { formatDate } from "../../../../components/ArticleCard";

export async function generateMetadata({ params }) {
  const article = await getBySlug(params.slug);
  return { title: article ? `${article.title} — XəbərPortal` : "Xəbər tapılmadı" };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }) {
  const article = await getBySlug(params.slug);
  if (!article) notFound();

  const related = (await getByCategory(article.category, { excludeId: article.id })).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl">
      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
        {categoryLabel(article.category)}
      </span>
      <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-ink">
        {article.title}
      </h1>
      <div className="mt-4 flex items-center gap-2 text-sm text-ink/50">
        <span className="font-medium text-ink/70">{article.author}</span>
        <span>·</span>
        <span>{formatDate(article.date)}</span>
      </div>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black/5">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="768px"
          className="object-cover"
        />
      </div>

      <div className="prose-content mt-8 text-[17px] text-ink/80">
        {article.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-14 border-t border-black/5 pt-8">
          <h2 className="text-lg font-bold text-ink mb-4">Aid olduğu bölmədən</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
