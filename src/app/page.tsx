import { Hero } from "@/components/Hero";
import { DateStrip } from "@/components/DateStrip";
import { MessageSection } from "@/components/MessageSection";
import { LocationSection } from "@/components/LocationSection";
import { Gallery } from "@/components/Gallery";
import { GenericRsvpNote } from "@/components/GenericRsvpNote";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <DateStrip />
      <MessageSection />
      <LocationSection />
      <Gallery />
      <GenericRsvpNote />
      <Footer />
    </main>
  );
}
