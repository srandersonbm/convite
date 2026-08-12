import { NextRequest, NextResponse } from "next/server";
import { query, type InviteLink } from "@/lib/db";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const rows = await query<InviteLink>(`SELECT * FROM invite_links WHERE token = $1`, [token]);
  const link = rows[0];

  if (!link) {
    return NextResponse.json({ state: "not_found" });
  }
  if (link.status === "confirmed") {
    return NextResponse.json({ state: "confirmed", confirmedName: link.confirmed_name });
  }
  if (link.status === "revoked") {
    return NextResponse.json({ state: "revoked" });
  }
  return NextResponse.json({ state: "pending" });
}
