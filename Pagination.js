import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// basePath: e.g. "/siyaset" or "/axtaris?q=foo" — pageParam is appended as ?page=N (or &page=N)
export default function Pagination({ currentPage, totalPages, basePath }) {
  if (totalPages <= 1) return null;

  const hasQuery = basePath.includes("?");
  const joiner = hasQuery ? "&" : "?";
  const hrefFor = (p) => (p <= 1 ? basePath.split("?")[0] + (hasQuery ? `?${basePath.split("?")[1]}` : "") : `${basePath}${joiner}page=${p}`);

  const pages = getPageList(currentPage, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Səhifələmə">
      <PageLink
        href={hrefFor(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Əvvəlki səhifə"
      >
        <ChevronLeft size={16} />
      </PageLink>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-ink/30 text-sm">
            …
          </span>
        ) : (
          <PageLink key={p} href={hrefFor(p)} active={p === currentPage}>
            {p}
          </PageLink>
        )
      )}

      <PageLink
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Növbəti səhifə"
      >
        <ChevronRight size={16} />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, active, disabled, children, ...rest }) {
  const base = "h-9 min-w-9 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
  if (disabled) {
    return (
      <span className={`${base} text-ink/20 cursor-not-allowed`} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} ${
        active ? "bg-brand-500 text-white" : "text-ink/60 hover:bg-black/5"
      }`}
      {...rest}
    >
      {children}
    </Link>
  );
}

function getPageList(current, total) {
  const delta = 1;
  const range = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i);
  }
  if (range[0] > 1) {
    range.unshift(1);
    if (range[1] > 2) range.splice(1, 0, "…");
  }
  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) range.push("…");
    range.push(total);
  }
  return range;
}
