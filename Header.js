"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { PRIMARY_CATEGORIES, MEGA_GROUPS } from "../data/categories";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/axtaris?q=${encodeURIComponent(query.trim())}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-3 h-16">
          {/* Hamburger / mega menu toggle */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Bölmələr menyusu"
              className={`flex items-center justify-center h-10 w-10 rounded-lg transition-colors ${
                menuOpen
                  ? "bg-brand-600 text-white"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {menuOpen && <MegaMenu onNavigate={() => setMenuOpen(false)} />}
          </div>

          {/* Logo */}
          <Link href="/" className="mr-2 shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-ink">
              Xəbər<span className="text-brand-500">Portal</span>
            </span>
          </Link>

          {/* Primary nav - desktop */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {PRIMARY_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`px-3 py-2 rounded-md text-[15px] font-medium whitespace-nowrap transition-colors ${
                  cat.slug === "son-xeber"
                    ? "text-accent-500 hover:bg-accent-500/10"
                    : "text-ink/80 hover:text-ink hover:bg-black/5"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="ml-auto flex items-center">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 bg-black/5 rounded-lg px-3 py-1.5"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Axtar..."
                  className="bg-transparent outline-none text-sm w-36 sm:w-52"
                />
                <button type="submit" aria-label="Axtar">
                  <Search size={18} className="text-ink/60" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Axtarışı aç"
                className="flex items-center justify-center h-10 w-10 rounded-lg border border-black/10 hover:bg-black/5 transition-colors"
              >
                <Search size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav (horizontal scroll) */}
        <nav className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {PRIMARY_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                cat.slug === "son-xeber"
                  ? "text-accent-500"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function MegaMenu({ onNavigate }) {
  return (
    <div className="absolute left-0 top-12 w-[92vw] max-w-4xl bg-white rounded-xl shadow-2xl ring-1 ring-black/5 p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4 z-50">
      {MEGA_GROUPS.map((group, i) => (
        <div key={i} className="flex flex-col gap-3">
          {group.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={onNavigate}
              className="text-sm text-ink/75 hover:text-brand-600 font-medium transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
