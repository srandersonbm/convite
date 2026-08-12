import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { EVENT } from "@/lib/content";

export function MessageSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="grid items-center gap-10 sm:grid-cols-[0.85fr_1.15fr] sm:gap-14">
        <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-[2rem] sm:max-w-none">
          <Image
            src="/photos/alessandra-3.jpg"
            alt={`${EVENT.guestName} sorrindo`}
            fill
            sizes="(min-width: 640px) 40vw, 80vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-ink/10" />
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-terracotta">
              Com carinho
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">
              “{EVENT.message}”
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 font-display text-lg text-forest">— {EVENT.guestName}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
