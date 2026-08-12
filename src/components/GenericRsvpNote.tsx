import { Reveal } from "@/components/Reveal";

export function GenericRsvpNote() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-cream-2/60 px-8 py-10 text-center">
        <p className="font-display text-xl italic text-forest">Este convite é pessoal</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          A confirmação de presença é feita pelo link exclusivo enviado no seu WhatsApp.
          Não encontrou o seu? Fale com quem te convidou.
        </p>
      </Reveal>
    </section>
  );
}
