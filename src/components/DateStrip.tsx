import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { EVENT } from "@/lib/content";

export function DateStrip() {
  return (
    <section className="bg-forest-dark px-6 py-14 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.35em] text-terracotta-light">
            Guarde a data
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-display text-2xl italic text-cream sm:text-3xl">
            {EVENT.weekdayLabel}, {EVENT.dateLabel} · {EVENT.timeLabel}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <Countdown />
        </Reveal>
      </div>
    </section>
  );
}
