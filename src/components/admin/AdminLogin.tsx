"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-forest-dark px-6">
      <form onSubmit={onSubmit} className="w-full max-w-xs text-center">
        <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-terracotta-light">
          Área administrativa
        </p>
        <h1 className="font-display mb-8 text-2xl italic text-cream">Convite da Alessandra</h1>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full rounded-full border border-cream/20 bg-cream/5 px-5 py-3 text-center text-sm text-cream placeholder:text-cream/40 outline-none focus:border-cream/50"
        />
        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="mt-3 w-full rounded-full bg-terracotta px-5 py-3 text-sm font-medium text-cream transition hover:brightness-110 disabled:opacity-40"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <p className="mt-4 text-xs text-terracotta-light">{error}</p>}
      </form>
    </main>
  );
}
