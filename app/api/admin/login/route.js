import { NextResponse } from "next/server";

// DEMO ÜÇÜN: istifadəçi adı/şifrə mühit dəyişənlərindən oxunur, təyin
// edilməyibsə default (admin / admin123) işləyir. PRODUCTION-A KEÇMƏZDƏN
// ƏVVƏL Vercel layihə ayarlarında ADMIN_USER və ADMIN_PASSWORD dəyişənlərini
// mütləq təyin edin.
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request) {
  const { username, password } = await request.json();

  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 saat
    });
    return res;
  }

  return NextResponse.json(
    { error: "İstifadəçi adı və ya şifrə yanlışdır." },
    { status: 401 }
  );
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
  return res;
}
