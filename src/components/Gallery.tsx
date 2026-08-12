"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/Reveal";

const PHOTOS = [
  { src: "/photos/alessandra-1.jpg", alt: "Alessandra Barbosa" },
  { src: "/photos/damata-3.jpg", alt: "Mesa posta no Damata Restaurante & Cachaçaria" },
  { src: "/photos/alessandra-2.jpg", alt: "Alessandra Barbosa" },
  { src: "/photos/damata-1.jpg", alt: "Área externa do Damata, em meio à natureza" },
  { src: "/photos/damata-4.jpg", alt: "Prato servido no Damata" },
  { src: "/photos/alessandra-5.jpg", alt: "Alessandra Barbosa" },
  { src: "/photos/damata-2.jpg", alt: "Salão do Damata Restaurante & Cachaçaria" },
  { src: "/photos/damata-5.jpg", alt: "Detalhe decorativo do Damata" },
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length)),
    []
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)),
    []
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, next, prev]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <Reveal>
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-terracotta">Momentos</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Um gostinho do que vem aí</h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {PHOTOS.map((photo, i) => (
          <Reveal key={photo.src} delay={(i % 6) * 0.05} className="aspect-square">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block h-full w-full overflow-hidden rounded-xl bg-cream-2"
              aria-label={`Ampliar foto: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-forest-dark/0 transition-colors duration-500 group-hover:bg-forest-dark/10" />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/95 px-4 py-8 backdrop-blur-sm"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-cream/80 transition hover:bg-cream/10 hover:text-cream"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream/80 transition hover:bg-cream/10 hover:text-cream sm:left-5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 2L4 8L10 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream/80 transition hover:bg-cream/10 hover:text-cream sm:right-5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2L12 8L6 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full max-h-[80vh] w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PHOTOS[openIndex].src}
                alt={PHOTOS[openIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
