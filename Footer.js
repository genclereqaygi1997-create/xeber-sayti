import Link from "next/link";
import { PRIMARY_CATEGORIES } from "../data/categories";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <span className="text-lg font-extrabold tracking-tight">
            Xəbər<span className="text-brand-500">Portal</span>
          </span>
          <p className="mt-3 text-sm text-ink/60 leading-relaxed">
            Ölkə və dünya xəbərləri, siyasət, iqtisadiyyat və sosial mövzularda
            operativ məlumat mənbəyi.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink/80 mb-3">Bölmələr</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {PRIMARY_CATEGORIES.slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="text-sm text-ink/60 hover:text-brand-600"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink/80 mb-3">Əlaqə</h4>
          <p className="text-sm text-ink/60">info@xeberportal.az</p>
          <p className="text-sm text-ink/60">Bakı, Azərbaycan</p>
        </div>
      </div>
      <div className="border-t border-black/5 py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} XəbərPortal. Bütün hüquqlar qorunur.
      </div>
    </footer>
  );
}
