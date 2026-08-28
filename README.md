# XəbərPortal

Next.js 14 (App Router) + Tailwind CSS ilə hazırlanmış müasir xəbər saytı. Ayrıca, ana səhifədə heç yerdə linki görünməyən `/admin` idarəetmə paneli var.

## Quraşdırma

```bash
npm install
npm run dev
```

Sayt: http://localhost:3000
Admin panel: http://localhost:3000/admin/login (demo: **admin** / **admin123**)

Şifrəni dəyişmək üçün `.env.example` faylını `.env.local` adı ilə köçürüb `ADMIN_USER` / `ADMIN_PASSWORD` dəyərlərini dəyişin.

## Struktur

- `app/(site)` — ictimai sayt (ana səhifə, bölmə səhifələri, məqalə səhifəsi, axtarış — hamısı səhifələmə ilə)
- `app/admin` — admin panel (giriş, dashboard, xəbər siyahısı, əlavə et/redaktə et, şəkil yükləmə)
- `app/api` — xəbərlər, giriş və şəkil yükləmə üçün API route-ları
- `app/sitemap.js`, `app/robots.js` — SEO üçün avtomatik yaradılan fayllar
- `components/ShareButtons.js` — sosial media paylaşım düymələri
- `components/Pagination.js` — səhifələmə komponenti
- `data/categories.js` — bütün bölmələrin siyahısı (əsas naviqasiya + hamburger meqa-menyu)
- `data/seed.json` — ilkin nümunə xəbərlər
- `lib/db.js` — məlumat saxlama qatı: Postgres (Neon/Vercel) qoşulubsa bazadan, olmasa fayldan oxuyur
- `lib/site.js` — saytın tam ünvanını müəyyən edir (SEO üçün)

## 🗄️ Verilənlər bazasını qoşmaq (xəbərlər itməsin deyə)

Layihə artıq **Postgres dəstəyi ilə** hazırlanıb (`@neondatabase/serverless` vasitəsilə). Baza qoşulmadan da işləyir (aşağıdakı fayl-rejimi ilə), amma production üçün bazanın qoşulması **çox tövsiyə olunur**.

### Necə qoşmaq olar (Vercel Marketplace, 2 dəqiqə)

1. Vercel dashboard → layihəniz → **Storage** tabı
2. **Create Database** → **Postgres** (Neon tərəfindən təmin olunur, pulsuz başlanğıc planı var)
3. Bazanı yaradıb layihənizə qoşduqdan sonra Vercel avtomatik olaraq `DATABASE_URL` (və ya `POSTGRES_URL`) mühit dəyişənini əlavə edir — heç bir əlavə kod dəyişikliyi lazım deyil
4. **Deployments** bölməsindən **Redeploy** edin

Bu qədər! Növbəti dəfə saytı açanda admin paneldəki yaşıl zolaq **"Postgres bazasına qoşulub"** yazacaq, cədvəl (`articles`) və ilkin nümunə xəbərlər avtomatik yaradılacaq, admin paneldən əlavə etdiyiniz hər xəbər isə artıq **daimi** saxlanılacaq.

### Yerli inkişafda bazanı istifadə etmək istəsəniz

```bash
npx vercel link        # layihəni Vercel hesabınıza bağlayın
npx vercel env pull .env.local   # baza dəyişənlərini yerli mühitə çəkin
npm run dev
```

### Baza qoşulmadıqda nə baş verir?

`lib/db.js` avtomatik olaraq `data/articles.runtime.json` faylına yazan ehtiyat rejiminə keçir — bu, sürətli sınaqlar və yerli inkişaf üçün əladır, lakin Vercel-in production serverless mühitində fayl sistemi read-only olduğundan bu rejimdə edilən dəyişikliklər **instansiya yenidən başlayanda itə bilər**. Admin paneldəki status zolağı (yaşıl/sarı) sizə hansı rejimdə olduğunuzu hər zaman göstərir.

## 🖼️ Şəkil yükləmək (kompüterdən birbaşa)

Admin panelində "Yeni xəbər" formasında artıq kompüterinizdən şəkil seçib birbaşa yükləyə bilərsiniz (əvvəlki kimi tək link yapışdırmaq da mümkündür). Bu, **Vercel Blob** anbarı ilə işləyir və Postgres-i necə qoşduqsansa, eyni sadəlikdə qoşulur:

1. Vercel dashboard → layihəniz → **Storage** tabı
2. **Create Database** → **Blob**
3. Yaradıb layihənizə qoşun (Postgres-də etdiyiniz kimi)
4. **Deployments** → **Redeploy**

Bundan sonra admin paneldəki "Kompüterdən şəkil seç" düyməsi işə düşəcək. Qoşulmayıbsa, sistem sizə aydın bir xəbərdarlıq göstərəcək və "Şəkil URL-i" sahəsindən əl ilə davam edə biləcəksiniz — sayt heç bir halda xarab olmur.

**Məhdudiyyətlər:** JPG/PNG/WEBP/GIF formatları, maksimum 8 MB.

## 📄 Səhifələmə (pagination)

Hər bölmə səhifəsi və axtarış nəticələri artıq avtomatik səhifələnir (hər səhifədə 9 xəbər). Xəbər sayı 9-dan azdırsa, səhifələmə düymələri özü görünmür — əlavə bir tənzimləmə lazım deyil. Səhifə ölçüsünü dəyişmək istəsəniz, hər iki səhifədəki (`app/(site)/[category]/page.js` və `app/(site)/axtaris/page.js`) `PAGE_SIZE` dəyişənini redaktə edin.

## 🔍 SEO (Google-da tapılma)

Layihəyə aşağıdakı SEO təkmilləşdirmələri əlavə olunub:

- Hər səhifə üçün ayrıca başlıq/təsvir (`<title>`, `<meta description>`)
- Open Graph və Twitter Card teqləri (sosial mediada paylaşılanda gözəl önizləmə üçün)
- Məqalə səhifələrində **NewsArticle** struktur məlumatı (JSON-LD) — Google-un xəbəri düzgün tanıması üçün
- Avtomatik `sitemap.xml` (`/sitemap.xml`) — bütün bölmə və məqalələri əhatə edir
- Avtomatik `robots.txt` (`/robots.txt`) — admin panelini axtarış motorlarından gizlədir

**Vacib addım:** SEO-nun tam işləməsi üçün `NEXT_PUBLIC_SITE_URL` mühit dəyişənini Vercel-də təyin edin (məsələn `https://xeberportal.az`, domen bağlamazdan əvvəl isə `https://sizin-layihe.vercel.app`). Bu olmasa, sistem avtomatik Vercel-in verdiyi ünvandan istifadə edir, amma öz domeninizi bağladıqdan sonra bunu yeniləməyi unutmayın.

## 📤 Sosial media paylaşımı

Hər məqalə səhifəsində Facebook, X (Twitter), WhatsApp, Telegram düymələri və "linki kopyala" seçimi var — başlığın altında və mətnin sonunda. Əlavə qurulum tələb olunmur.

## Vercel-ə deploy

1. Layihəni GitHub-a yükləyin.
2. [vercel.com](https://vercel.com) → "New Project" → repo-nu seçin.
3. Environment Variables bölməsinə `ADMIN_USER` və `ADMIN_PASSWORD` əlavə edin.
4. Deploy edin.
5. (Tövsiyə olunur) Yuxarıdakı **"Verilənlər bazasını qoşmaq"** addımlarını izləyib Postgres bazası qoşun.
6. (Tövsiyə olunur) **"Şəkil yükləmək"** addımlarını izləyib Blob anbarı qoşun.
7. (Tövsiyə olunur) `NEXT_PUBLIC_SITE_URL` mühit dəyişənini əlavə edin.

## Dizayn qeydləri

- Şrift: Inter (Google Fonts, `next/font` ilə optimallaşdırılıb)
- Rəng palitri: neytral fon (`#fafaf9`) + mavi əsas rəng + qırmızı vurğu rəngi (yalnız "Son xəbər" və breaking-tipli elementlər üçün) — gözü yormayan, lakin diqqət çəkən kontrast
- Bütün şəkillər `next/image` ilə optimallaşdırılır (lazy-loading, responsive ölçülər)
