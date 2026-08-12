import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { query, type InviteLink } from "@/lib/db";

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { token } = await ctx.params;
  const rows = await query<InviteLink>(
    `UPDATE invite_links SET status = 'revoked'
     WHERE token = $1 AND status = 'pending'
     RETURNING *`,
    [token]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Link não encontrado ou já confirmado/revogado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ link: rows[0] });
}
