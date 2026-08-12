import { Reveal } from "@/components/Reveal";
import { EVENT } from "@/lib/content";

export function LocationSection() {
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    EVENT.mapsEmbedQuery
  )}&hl=pt-BR&output=embed`;

  return (
    <section className="bg-cream-2 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-terracotta">
            Onde vai ser
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{EVENT.venueName}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-2 text-sm text-ink/60">{EVENT.venueCity}</p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 overflow-hidden rounded-2xl shadow-sm ring-1 ring-ink/10">
          <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
            <iframe
              src={embedSrc}
              title={`Mapa do local: ${EVENT.venueName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full grayscale-[15%]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.28} className="mt-8">
          <a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-cream transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            Abrir no Google Maps
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M3 11L11 3M11 3H4M11 3V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
