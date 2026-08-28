import { notFound } from "next/navigation";
import { getById } from "../../../../../lib/db";
import ArticleForm from "../../../../../components/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }) {
  const article = await getById(params.id);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">Xəbəri redaktə et</h1>
      <ArticleForm initial={article} articleId={article.id} />
    </div>
  );
}
