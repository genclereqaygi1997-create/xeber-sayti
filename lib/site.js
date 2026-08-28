// Saytın tam ünvanını müəyyən edir — SEO metadata (canonical, Open Graph,
// sitemap) üçün istifadə olunur.
//
// Prioritet:
// 1. NEXT_PUBLIC_SITE_URL — özünüz təyin etsəniz (öz domeninizi bağladıqdan
//    sonra Vercel-də bunu əlavə etməyiniz tövsiyə olunur, məs:
//    https://xeberportal.az)
// 2. VERCEL_URL — Vercel-in avtomatik verdiyi *.vercel.app ünvanı
// 3. Yerli inkişaf üçün localhost
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "XəbərPortal";
