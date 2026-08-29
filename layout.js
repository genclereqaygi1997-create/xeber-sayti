"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Newspaper, PlusCircle, LogOut, ExternalLink } from "lucide-react";

const NAV = [
  { href: "/admin", label: "İdarəetmə paneli", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Bütün xəbərlər", icon: Newspaper },
  { href: "/admin/articles/new", label: "Yeni xəbər", icon: PlusCircle },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#f5f6f8]">
      <aside className="hidden sm:flex w-64 shrink-0 flex-col bg-ink text-white">
        <div className="h-16 flex items-center px-6 font-extrabold tracking-tight text-lg border-b border-white/10">
          Xəbər<span className="text-brand-400">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-500 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink size={18} />
            Saytı gör
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
          >
            <LogOut size={18} />
            Çıxış
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sm:hidden h-14 flex items-center justify-between px-4 bg-ink text-white">
          <span className="font-extrabold">
            Xəbər<span className="text-brand-400">Admin</span>
          </span>
          <button onClick={handleLogout} className="text-sm text-white/70">
            Çıxış
          </button>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
