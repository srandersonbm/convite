"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

type InviteState = "pending" | "confirmed" | "revoked" | "not_found";

function SuccessCheck() {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      initial="hidden"
      animate="show"
    >
      <motion.circle
        cx="28"
        cy="28"
        r="26"
        stroke="var(--color-forest)"
        strokeWidth="2"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M17 29L24.5 36.5L39.5 20.5"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
    </motion.svg>
  );
}

export function RsvpForm({
  token,
  initialState,
  initialConfirmedName,
  suggestedName,
}: {
  token: string;
  initialState: InviteState;
  initialConfirmedName: string | null;
  suggestedName?: string;
}) {
  const [state, setState] = useState<InviteState>(initialState);
  const [confirmedName, setConfirmedName] = useState(initialConfirmedName);
  const [name, setName] = useState(suggestedName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/invite/${token}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.state === "confirmed") {
          setState("confirmed");
          setConfirmedName(data.confirmedName);
        } else if (data.state === "revoked") {
          setState("revoked");
        } else {
          setError(data.error ?? "Não foi possível confirmar. Tente novamente.");
        }
        setLoading(false);
        return;
      }
      setState("confirmed");
      setConfirmedName(data.confirmedName);
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <section id="confirmar" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-cream-2/70 px-7 py-10 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset] sm:px-10">
        <AnimatePresence mode="wait">
          {state === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-terracotta">
                Confirme sua presença
              </p>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                {suggestedName ? `Oi, ${suggestedName.split(" ")[0]}! Você vai estar lá?` : "Você vai estar lá?"}
              </h2>
              <form onSubmit={onSubmit} className="mt-8 flex flex-col items-stretch gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  minLength={2}
                  className="rounded-full border border-ink/15 bg-cream px-5 py-3.5 text-center text-sm text-ink placeholder:text-ink/35 outline-none transition focus:border-forest"
                />
                <button
                  type="submit"
                  disabled={loading || name.trim().length < 2}
                  className="rounded-full bg-forest px-5 py-3.5 text-sm font-medium text-cream transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
                >
                  {loading ? "Confirmando..." : "Confirmar presença"}
                </button>
              </form>
              {error && <p className="mt-4 text-xs text-terracotta">{error}</p>}
              <p className="mt-6 text-[11px] leading-relaxed text-ink/40">
                Depois de confirmar, este link não poderá ser usado novamente.
              </p>
            </motion.div>
          )}

          {state === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <SuccessCheck />
              <h2 className="font-display mt-5 text-2xl text-ink sm:text-3xl">
                Presença confirmada!
              </h2>
              <p className="mt-3 text-sm text-ink/60">
                {confirmedName ? (
                  <>
                    Combinado, <span className="font-medium text-forest">{confirmedName}</span>! Vai
                    ser uma alegria te ver lá. 🎉
                  </>
                ) : (
                  "Vai ser uma alegria te ver lá. 🎉"
                )}
              </p>
            </motion.div>
          )}

          {state === "revoked" && (
            <motion.div key="revoked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl text-ink">Convite indisponível</h2>
              <p className="mt-3 text-sm text-ink/60">
                Este link não está mais ativo. Fale com quem te convidou para saber mais.
              </p>
            </motion.div>
          )}

          {state === "not_found" && (
            <motion.div key="not_found" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl text-ink">Convite não encontrado</h2>
              <p className="mt-3 text-sm text-ink/60">
                Verifique se o link foi copiado corretamente, ou peça um novo convite.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
