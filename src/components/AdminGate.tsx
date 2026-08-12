"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

export function AdminGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
      router.push("/admin");
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] uppercase tracking-[0.25em] text-cream/35 transition-colors hover:text-cream/70"
      >
        Área administrativa
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.form
        initial={{ opacity: 0, y: 10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={onSubmit}
        className="flex w-full max-w-xs flex-col items-center gap-3"
      >
        <div className="flex w-full items-center gap-2">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de administrador"
            className="w-full rounded-full border border-cream/20 bg-cream/5 px-4 py-2 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-cream/50"
          />
          <button
            type="submit"
            disabled={loading || password.length === 0}
            className="shrink-0 rounded-full bg-cream/10 px-4 py-2 text-sm text-cream transition hover:bg-cream/20 disabled:opacity-40"
          >
            {loading ? "..." : "Entrar"}
          </button>
        </div>
        {error && <p className="text-xs text-terracotta-light">{error}</p>}
      </motion.form>
    </AnimatePresence>
  );
}
