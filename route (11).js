import { NextResponse } from "next/server";
import { getAllArticles, createArticle } from "../../../lib/db";

export async function GET() {
  return NextResponse.json(await getAllArticles());
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.category) {
    return NextResponse.json(
      { error: "Başlıq və bölmə mütləqdir." },
      { status: 400 }
    );
  }
  const article = await createArticle(body);
  return NextResponse.json(article, { status: 201 });
}
