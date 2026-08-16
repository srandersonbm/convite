import { Reveal } from "@/components/Reveal";

export function GenericRsvpNote() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-md rounded-2xl border border-terracotta/25 bg-terracotta/5 px-8 py-10 text-center">
        <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M10 2C6.7 2 4 4.7 4 8v3.5L2.3 14.2c-.3.5.1 1.1.7 1.1h14c.6 0 1-.6.7-1.1L16 11.5V8c0-3.3-2.7-6-6-6Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M7.5 17.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <p className="font-display text-xl italic text-forest">Não esqueça de confirmar</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          Sua presença só é confirmada pelo link exclusivo enviado no seu WhatsApp — este
          convite não tem formulário próprio. Não encontrou o seu link? Fale com quem te
          convidou.
        </p>
      </Reveal>
    </section>
  );
}
