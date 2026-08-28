import { NextResponse } from "next/server";
import { getById, updateArticle, deleteArticle } from "../../../../lib/db";

export async function GET(_request, { params }) {
  const article = await getById(params.id);
  if (!article) {
    return NextResponse.json({ error: "Tapılmadı." }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const updated = await updateArticle(params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "Tapılmadı." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  const ok = await deleteArticle(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Tapılmadı." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
