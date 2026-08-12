import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { DateStrip } from "@/components/DateStrip";
import { MessageSection } from "@/components/MessageSection";
import { LocationSection } from "@/components/LocationSection";
import { Gallery } from "@/components/Gallery";
import { RsvpForm } from "@/components/RsvpForm";
import { Footer } from "@/components/Footer";
import { query, type InviteLink } from "@/lib/db";
import { EVENT } from "@/lib/content";

export const metadata: Metadata = { title: `Convite · ${EVENT.title}` };

async function getInvite(token: string) {
  const rows = await query<InviteLink>(`SELECT * FROM invite_links WHERE token = $1`, [token]);
  return rows[0] ?? null;
}

export default async function GuestInvitePage({ params }: PageProps<"/c/[token]">) {
  const { token } = await params;
  const invite = await getInvite(token);

  const initialState = !invite ? "not_found" : invite.status;
  const initialConfirmedName = invite?.confirmed_name ?? null;
  const suggestedName = invite?.status === "pending" ? invite.guest_label : undefined;

  return (
    <main>
      <Hero />
      <DateStrip />
      <MessageSection />
      <LocationSection />
      <Gallery />
      <RsvpForm
        token={token}
        initialState={initialState}
        initialConfirmedName={initialConfirmedName}
        suggestedName={suggestedName}
      />
      <Footer />
    </main>
  );
}
