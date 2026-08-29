// Ekran görüntüsündəki menyu strukturuna əsaslanır.
// `primary`: əsas naviqasiya zolağında görünən bölmələr
// `group`: hamburger meqa-menyusundakı sütun qruplaşdırması

export const CATEGORIES = [
  { slug: "son-xeber", label: "Son xəbər", primary: true, color: "accent" },
  { slug: "olke", label: "Ölkə", primary: true },
  { slug: "dunya", label: "Dünya", primary: true },
  { slug: "siyaset", label: "Siyasət", primary: true },
  { slug: "iqtisadiyyat", label: "İqtisadiyyat", primary: true },
  { slug: "sosial", label: "Sosial", primary: true },
  { slug: "hadise", label: "Hadisə", primary: true },
  { slug: "kriminal", label: "Kriminal", primary: true },
  { slug: "tehsil", label: "Təhsil", primary: true },
  { slug: "analitika", label: "Analitika", primary: true },
  { slug: "yazarlar", label: "Yazarlar", primary: true },

  // Meqa-menyu (hamburger) — sütunlara görə qruplaşdırılıb
  { slug: "yazarlar-2", label: "Yazarlar", group: 1 },
  { slug: "yaxin-tarix", label: "Yaxın tarix", group: 1 },
  { slug: "musahibe", label: "Müsahibə", group: 1 },
  { slug: "medeniyyet", label: "Mədəniyyət", group: 1 },
  { slug: "idman", label: "İdman", group: 1 },
  { slug: "maraqli", label: "Maraqlı", group: 1 },
  { slug: "rasmi", label: "Rəsmi", group: 1 },

  { slug: "qalmaqal", label: "Qalmaqal", group: 2 },
  { slug: "gundem", label: "Gündəm", group: 2 },
  { slug: "media", label: "Media", group: 2 },
  { slug: "proje", label: "Proje", group: 2 },
  { slug: "menaviyyat", label: "Mənəviyyat", group: 2 },
  { slug: "yasam", label: "Yaşam", group: 2 },

  { slug: "astrologiya", label: "Astrologiya", group: 3 },
  { slug: "oxucu-poctu", label: "Oxucu poçtu", group: 3 },
  { slug: "bizim-qonaq", label: "Bizim qonaq", group: 3 },
  { slug: "metbuat-bugun", label: "Mətbuat bugün", group: 3 },
  { slug: "guney-hadiseleri", label: "Güney hadisələri", group: 3 },
  { slug: "qarabag-xeberleri", label: "Qarabağ xəbərləri", group: 3 },

  { slug: "fotosessiya", label: "Fotosessiya", group: 4 },
  { slug: "vaxt-axari", label: "Vaxt axarı", group: 4 },
  { slug: "foto-fakt", label: "Foto fakt", group: 4 },
  { slug: "reportaj", label: "Reportaj", group: 4 },
  { slug: "xeber-xetti", label: "Xəbər xətti", group: 4 },
  { slug: "sozsuz", label: "Sözsüz", group: 4 },

  { slug: "dunyanin-bu-uzu", label: "Dünyanın bu üzü", group: 5 },
  { slug: "video", label: "Video", group: 5 },
  { slug: "kivdf-layiheleri", label: "KİVDF layihələri", group: 5 },
  { slug: "yavru-vatanin-sesi", label: "Yavru Vatanın səsi", group: 5 },
  { slug: "sehiyye", label: "Səhiyyə", group: 5 },
  { slug: "sou-biznes", label: "Şou-biznes", group: 5 },

  { slug: "region", label: "Region", group: 6 },
  { slug: "texnologiya", label: "Texnologiya", group: 6 },
  { slug: "arasdirma", label: "Araşdırma", group: 6 },
  { slug: "formula-1", label: "Formula #1", group: 6 },
  { slug: "islamiada", label: "İslamiada", group: 6 },
  { slug: "herbi-xeberler", label: "Hərbi xəbərlər", group: 6 },
];

export const PRIMARY_CATEGORIES = CATEGORIES.filter((c) => c.primary);
export const MEGA_GROUPS = [1, 2, 3, 4, 5, 6].map((g) =>
  CATEGORIES.filter((c) => c.group === g)
);

export function categoryLabel(slug) {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found ? found.label : slug;
}
