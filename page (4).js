"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Giriş uğursuz oldu.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-500 text-white mx-auto mb-5">
          <Lock size={22} />
        </div>
        <h1 className="text-xl font-extrabold text-center text-ink">
          Admin Panelə Giriş
        </h1>
        <p className="text-center text-sm text-ink/45 mt-1 mb-6">
          XəbərPortal idarəetmə paneli
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">
              İstifadəçi adı
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Şifrə</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-accent-500 bg-accent-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 transition-colors disabled:opacity-60"
          >
            {loading ? "Yoxlanılır..." : "Daxil ol"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/30 mt-6">
          Demo giriş: admin / admin123 (mühit dəyişənləri ilə dəyişdirilə bilər)
        </p>
      </div>
    </div>
  );
}
