import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import seed from "../data/seed.json";

// ---------------------------------------------------------------------------
// VERİLƏNLƏR QATI
// ---------------------------------------------------------------------------
// Vercel-in Marketplace-dən qoşduğunuz Postgres inteqrasiyası (Neon, Supabase
// və s.) mühit dəyişəninin adını inteqrasiyadan asılı olaraq fərqli təyin edə
// bilər (DATABASE_URL, POSTGRES_URL, DATABASE_URL_UNPOOLED və s.) — buna görə
// bir neçə mümkün adı ardıcıl yoxlayırıq ki, hansı inteqrasiyanı seçsəniz də
// işləsin.
//
// Heç biri tapılmadıqda (məs. hələ heç bir baza qoşmamısınızsa, ya da yerli
// inkişaf zamanı) sistem avtomatik köhnə fayl-əsaslı saxlamaya keçir ki,
// layihə baza olmadan da işə düşə bilsin. Quraşdırma üçün README.md-yə baxın.
// ---------------------------------------------------------------------------

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  null;

const USE_DB = !!CONNECTION_STRING;
const sql = USE_DB ? neon(CONNECTION_STRING) : null;

let schemaReady = null;

async function ensureSchema() {
  if (!USE_DB) return;
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        excerpt TEXT DEFAULT '',
        image TEXT DEFAULT '',
        author TEXT DEFAULT '',
        date TIMESTAMPTZ NOT NULL DEFAULT now(),
        featured BOOLEAN NOT NULL DEFAULT false,
        content TEXT DEFAULT ''
      );
    `;

    const rows = await sql`SELECT COUNT(*)::int AS count FROM articles;`;
    if (rows[0].count === 0) {
      for (const a of seed) {
        await sql`
          INSERT INTO articles (id, title, slug, category, excerpt, image, author, date, featured, content)
          VALUES (${a.id}, ${a.title}, ${a.slug}, ${a.category}, ${a.excerpt}, ${a.image}, ${a.author}, ${a.date}, ${!!a.featured}, ${a.content})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  })();

  return schemaReady;
}

function rowToArticle(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt || "",
    image: row.image || "",
    author: row.author || "",
    date: new Date(row.date).toISOString(),
    featured: !!row.featured,
    content: row.content || "",
  };
}

function slugify(str) {
  const map = { ə: "e", ı: "i", ö: "o", ü: "u", ç: "c", ş: "s", ğ: "g", "İ": "i", "Ə": "e", "Ö": "o", "Ü": "u", "Ç": "c", "Ş": "s", "Ğ": "g" };
  return str
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// ---------------------------------------------------------------------------
// FAYL-ƏSASLI EHTİYAT REJİMİ (yalnız POSTGRES_URL yoxdursa istifadə olunur)
// ---------------------------------------------------------------------------

const DATA_FILE = path.join(process.cwd(), "data", "articles.runtime.json");

function fileReadAll() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), "utf-8");
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return seed;
  }
}

function fileWriteAll(articles) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// PUBLİK API — bütün funksiyalar async-dir (DB rejiminə uyğun olsun deyə)
// ---------------------------------------------------------------------------

export async function getAllArticles() {
  if (USE_DB) {
    await ensureSchema();
    const rows = await sql`SELECT * FROM articles ORDER BY date DESC;`;
    return rows.map(rowToArticle);
  }
  return fileReadAll().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getFeatured(limit = 5) {
  const all = await getAllArticles();
  const featured = all.filter((a) => a.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getByCategory(category, { excludeId } = {}) {
  const all = await getAllArticles();
  return all.filter((a) => a.category === category && a.id !== excludeId);
}

export async function getBySlug(slug) {
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug) || null;
}

export async function getById(id) {
  const all = await getAllArticles();
  return all.find((a) => a.id === id) || null;
}

export async function searchArticles(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getAllArticles();
  return all.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
  );
}

export async function createArticle(input) {
  const all = await getAllArticles();
  const id = String(Date.now());
  const slugBase = slugify(input.title || "xeber");
  let slug = slugBase;
  let n = 1;
  while (all.some((a) => a.slug === slug)) {
    slug = `${slugBase}-${n++}`;
  }
  const article = {
    id,
    title: input.title || "Başlıqsız xəbər",
    slug,
    category: input.category || "son-xeber",
    excerpt: input.excerpt || "",
    image:
      input.image ||
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600&auto=format&fit=crop",
    author: input.author || "Redaksiya",
    date: new Date().toISOString(),
    featured: !!input.featured,
    content: input.content || "",
  };

  if (USE_DB) {
    await ensureSchema();
    await sql`
      INSERT INTO articles (id, title, slug, category, excerpt, image, author, date, featured, content)
      VALUES (${article.id}, ${article.title}, ${article.slug}, ${article.category}, ${article.excerpt}, ${article.image}, ${article.author}, ${article.date}, ${article.featured}, ${article.content});
    `;
  } else {
    all.push(article);
    fileWriteAll(all);
  }
  return article;
}

export async function updateArticle(id, input) {
  const existing = await getById(id);
  if (!existing) return null;
  const updated = { ...existing, ...input, id };

  if (USE_DB) {
    await ensureSchema();
    await sql`
      UPDATE articles SET
        title = ${updated.title},
        category = ${updated.category},
        excerpt = ${updated.excerpt},
        image = ${updated.image},
        author = ${updated.author},
        featured = ${!!updated.featured},
        content = ${updated.content}
      WHERE id = ${id};
    `;
  } else {
    const all = fileReadAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx] = updated;
    fileWriteAll(all);
  }
  return updated;
}

export async function deleteArticle(id) {
  if (USE_DB) {
    await ensureSchema();
    await sql`DELETE FROM articles WHERE id = ${id};`;
    return true;
  }
  const all = fileReadAll();
  const next = all.filter((a) => a.id !== id);
  fileWriteAll(next);
  return next.length !== all.length;
}

export const isUsingDatabase = USE_DB;
