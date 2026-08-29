import { getAllArticles } from "../lib/db";
import { CATEGORIES } from "../data/categories";
import { getSiteUrl } from "../lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = getSiteUrl();
  const articles = await getAllArticles();

  const staticEntries = [
    { url: base, changeFrequency: "hourly", priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${base}/${c.slug}`,
      changeFrequency: "hourly",
      priority: 0.7,
    })),
  ];

  const articleEntries = articles.map((a) => ({
    url: `${base}/${a.category}/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
