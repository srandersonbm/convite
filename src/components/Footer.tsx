import { AdminGate } from "@/components/AdminGate";
import { Reveal } from "@/components/Reveal";
import { EVENT } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-forest-dark px-6 pb-10 pt-20 sm:pt-24">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        {EVENT.closingMessage && (
          <Reveal>
            <p className="text-sm leading-relaxed text-cream/70">{EVENT.closingMessage}</p>
          </Reveal>
        )}
        <Reveal delay={0.04}>
          <p className="font-display text-2xl italic text-cream/90">Com carinho,</p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="font-display text-xl text-terracotta-light">{EVENT.guestName}</p>
        </Reveal>

        <div className="mt-10 h-px w-12 bg-cream/15" />

        <div className="mt-4">
          <AdminGate />
        </div>
      </div>
    </footer>
  );
}
