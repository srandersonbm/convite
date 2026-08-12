import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { query } from "@/lib/db";

// Exclui definitivamente um link — só permite apagar links já revogados,
// pra não correr risco de perder um convite pendente ou uma confirmação por
// engano (esses só saem revogando antes).
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { token } = await ctx.params;
  const rows = await query<{ token: string }>(
    `DELETE FROM invite_links WHERE token = $1 AND status = 'revoked' RETURNING token`,
    [token]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Link não encontrado ou não está revogado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
