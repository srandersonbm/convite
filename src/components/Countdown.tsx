"use client";

import { useRef, useSyncExternalStore } from "react";
import { EVENT } from "@/lib/content";

type Parts = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function getParts(target: number): Parts {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

function samePart(a: Parts, b: Parts) {
  return a.days === b.days && a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds && a.done === b.done;
}

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

const UNITS: { key: keyof Parts; label: string }[] = [
  { key: "days", label: "dias" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
];

export function Countdown() {
  const target = new Date(EVENT.dateISO).getTime();
  const cacheRef = useRef<Parts | null>(null);

  // useSyncExternalStore evita mismatch de hidratação (servidor e cliente têm
  // "agora" diferentes) sem precisar de setState dentro de um efeito. O
  // snapshot é cacheado por referência — só troca quando os valores exibidos
  // realmente mudam — como o hook exige para não reexecutar à toa.
  const parts = useSyncExternalStore(
    subscribe,
    () => {
      const next = getParts(target);
      if (cacheRef.current && samePart(cacheRef.current, next)) return cacheRef.current;
      cacheRef.current = next;
      return next;
    },
    () => null
  );

  if (!parts) {
    return <div className="h-[76px] sm:h-[92px]" aria-hidden />;
  }

  if (parts.done) {
    return (
      <p className="font-display text-xl italic text-cream sm:text-2xl">
        A festa é hoje! 🎉
      </p>
    );
  }

  return (
    <div className="flex items-start gap-3 sm:gap-5" role="timer" aria-label="Contagem regressiva para a festa">
      {UNITS.map((u) => (
        <div key={u.key} className="flex flex-col items-center">
          <span className="font-display tabular-nums text-3xl text-cream sm:text-4xl">
            {String(parts[u.key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream/60 sm:text-xs">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
