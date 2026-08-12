import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { query, type InviteLink } from "@/lib/db";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const rows = await query<InviteLink>(
    `SELECT id, token, guest_label, status, created_at, confirmed_name, confirmed_at
     FROM invite_links ORDER BY created_at DESC`
  );
  return NextResponse.json({ guests: rows });
}
