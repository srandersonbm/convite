"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { EVENT } from "@/lib/content";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-forest-dark">
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        <Image
          src="/photos/alessandra-4.jpg"
          alt={`Retrato de ${EVENT.guestName}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_20%]"
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,38,29,0.55) 0%, rgba(28,38,29,0.15) 30%, rgba(28,38,29,0.35) 62%, rgba(20,26,20,0.92) 100%)",
        }}
      />

      {/* numeral 50 decorativo, sutil, ancorado no topo */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 0.16, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="font-display pointer-events-none absolute -top-6 right-[-0.15em] select-none text-[42vw] italic leading-none text-cream sm:text-[30vw]"
      >
        50
      </motion.span>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative flex h-full flex-col justify-end px-6 pb-16 sm:items-center sm:px-10 sm:pb-20 sm:text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-terracotta-light"
        >
          Você está convidado(a)
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-display max-w-2xl text-[2.75rem] leading-[1.05] text-cream sm:text-6xl"
        >
          {EVENT.age} anos de{" "}
          <span className="italic text-terracotta-light">{EVENT.guestName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-sm uppercase tracking-[0.2em] text-cream/85 sm:text-base"
        >
          {EVENT.dateLabel} · {EVENT.venueName}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8"
        >
          <div className="animate-bounce-soft flex flex-col items-center gap-1 text-cream/70">
            <span className="text-[10px] uppercase tracking-[0.3em]">Deslize</span>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <path d="M1 1L7 18L13 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
