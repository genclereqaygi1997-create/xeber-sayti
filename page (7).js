import Image from "next/image";
import { notFound } from "next/navigation";
import { getBySlug, getByCategory } from "../../../../lib/db";
import { categoryLabel } from "../../../../data/categories";
import ArticleCard, { formatDate } from "../../../../components/ArticleCard";
import ShareButtons from "../../../../components/ShareButtons";
import { getSiteUrl } from "../../../../lib/site";

export async function generateMetadata({ params }) {
  const article = await getBySlug(params.slug);
  if (!article) return { title: "Xəbər tapılmadı" };

  const url = `${getSiteUrl()}/${article.category}/${article.slug}`;
  const description = article.excerpt || article.content.slice(0, 160);

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : undefined,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      section: categoryLabel(article.category),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }) {
  const article = await getBySlug(params.slug);
  if (!article) notFound();

  const related = (await getByCategory(article.category, { excludeId: article.id })).slice(0, 3);
  const url = `${getSiteUrl()}/${article.category}/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.image ? [article.image] : undefined,
    datePublished: article.date,
    dateModified: article.date,
    author: article.author ? [{ "@type": "Person", name: article.author }] : undefined,
    publisher: {
      "@type": "Organization",
      name: "XəbərPortal",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <article className="mx-auto max-w-3xl">
      {/* Google, Facebook və digər axtarış/paylaşım robotları üçün struktur məlumat */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
        {categoryLabel(article.category)}
      </span>
      <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-ink">
        {article.title}
      </h1>
      <div className="mt-4 flex items-center gap-2 text-sm text-ink/50">
        <span className="font-medium text-ink/70">{article.author}</span>
        <span>·</span>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
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

      <div className="mt-6">
        <ShareButtons url={url} title={article.title} />
      </div>

      <div className="prose-content mt-8 text-[17px] text-ink/80">
        {article.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-8 border-t border-black/5 pt-6">
        <ShareButtons url={url} title={article.title} />
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
