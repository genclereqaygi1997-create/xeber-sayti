import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// ---------------------------------------------------------------------------
// ŞƏKİL YÜKLƏMƏ
// ---------------------------------------------------------------------------
// Bu marşrut Vercel Blob (fayl anbarı) xidmətinə şəkil yükləyir və ictimai
// linkini qaytarır. İşləməsi üçün layihənizə Vercel-in "Storage" bölməsindən
// bir "Blob" anbarı qoşulmalıdır (Postgres-i necə qoşduqsa, eyni məntiqlə) —
// ətraflı məlumat README.md-dədir.
//
// Anbar qoşulmayıbsa, aydın bir xəta mesajı qaytarırıq ki, admin panelindəki
// "Şəkil URL-i" sahəsindən əl ilə davam edə bilsin.
// ---------------------------------------------------------------------------

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Şəkil anbarı (Vercel Blob) qoşulmayıb. README.md-dəki 'Şəkil yükləmə' bölməsinə baxın, ya da aşağıdakı sahəyə birbaşa şəkil linki yapışdırın.",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Fayl tapılmadı." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Yalnız JPG, PNG, WEBP və ya GIF formatları qəbul olunur." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fayl çox böyükdür (maksimum 8 MB)." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const key = `xeberler/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
