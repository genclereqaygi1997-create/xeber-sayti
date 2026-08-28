import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getAllArticles } from "../../lib/db";
import { categoryLabel } from "../../data/categories";
import ArticleCard, { formatRelative } from "../../components/ArticleCard";

export const dynamic = "force-dynamic";

function SectionHeading({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
        <span className="h-5 w-1.5 rounded-full bg-brand-500" />
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Hamısına bax <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function CategoryRow({ slug, all }) {
  const articles = all.filter((a) => a.category === slug).slice(0, 4);
  if (!articles.length) return null;
  return (
    <section className="mt-12">
      <SectionHeading title={categoryLabel(slug)} href={`/${slug}`} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const all = await getAllArticles();

  const featured = all.filter((a) => a.featured);
  const heroPool = featured.length ? featured : all;
  const [hero, ...rest] = heroPool;
  const secondary = rest.length ? rest : all.slice(1, 3);
  const latest = all.slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="grid gap-6 lg:grid-cols-3">
        {hero && (
          <Link
            href={`/${hero.category}/${hero.slug}`}
            className="group relative lg:col-span-2 block overflow-hidden rounded-2xl bg-black/5 min-h-[320px] sm:min-h-[420px]"
          >
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {categoryLabel(hero.category)}
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white leading-tight max-w-2xl">
                {hero.title}
              </h1>
              <p className="mt-2 text-sm text-white/70">
                {hero.author} · {formatRelative(hero.date)}
              </p>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-6">
          {secondary.slice(0, 2).map((a) => (
            <Link
              key={a.id}
              href={`/${a.category}/${a.slug}`}
              className="group relative flex-1 min-h-[150px] sm:min-h-[195px] block overflow-hidden rounded-2xl bg-black/5"
            >
              <Image
                src={a.image}
                alt={a.title}
                fill
                sizes="33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                  {categoryLabel(a.category)}
                </span>
                <h2 className="mt-2 text-[15px] font-bold text-white leading-snug line-clamp-2">
                  {a.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST STRIP */}
      <section className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading title="Son xəbərlər" href="/son-xeber" />
          <div className="grid gap-6 sm:grid-cols-2">
            {latest.slice(0, 4).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink/50 mb-2 px-2">
            Ən çox oxunanlar
          </h3>
          <div className="flex flex-col divide-y divide-black/5">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      <CategoryRow slug="siyaset" all={all} />
      <CategoryRow slug="iqtisadiyyat" all={all} />
      <CategoryRow slug="dunya" all={all} />
      <CategoryRow slug="sosial" all={all} />
      <CategoryRow slug="idman" all={all} />
    </div>
  );
}
