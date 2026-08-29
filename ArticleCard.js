import Link from "next/link";
import Image from "next/image";
import { categoryLabel } from "../data/categories";

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("az-AZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatRelative(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "az əvvəl";
  if (hours < 24) return `${hours} saat əvvəl`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün əvvəl`;
  return formatDate(iso);
}

export default function ArticleCard({ article, variant = "vertical" }) {
  const href = `/${article.category}/${article.slug}`;

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className="group flex gap-4 items-start p-3 rounded-xl hover:bg-black/[0.03] transition-colors"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-black/5">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            {categoryLabel(article.category)}
          </span>
          <h3 className="mt-1 text-[15px] font-semibold leading-snug line-clamp-2 text-ink group-hover:text-brand-600 transition-colors">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-ink/45">
            {formatRelative(article.date)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/5">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 shadow-sm">
          {categoryLabel(article.category)}
        </span>
      </div>
      <h3 className="mt-3 text-[17px] font-bold leading-snug line-clamp-2 text-ink group-hover:text-brand-600 transition-colors">
        {article.title}
      </h3>
      <p className="mt-1.5 text-sm text-ink/55 line-clamp-2">
        {article.excerpt}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs text-ink/40">
        <span>{article.author}</span>
        <span>·</span>
        <span>{formatRelative(article.date)}</span>
      </div>
    </Link>
  );
}
