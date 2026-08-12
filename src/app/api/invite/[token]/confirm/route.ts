import { NextRequest, NextResponse } from "next/server";
import { query, type InviteLink } from "@/lib/db";

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;

  let name: unknown;
  try {
    const body = await req.json();
    name = body?.name;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Digite seu nome completo." }, { status: 400 });
  }
  const cleanName = name.trim().slice(0, 120);

  // UPDATE condicional: só confirma se ainda estiver 'pending'. Isso garante
  // atomicidade — mesmo em requisições simultâneas, apenas uma confirma e o
  // link expira imediatamente para qualquer uso futuro.
  const rows = await query<InviteLink>(
    `UPDATE invite_links
     SET status = 'confirmed', confirmed_name = $1, confirmed_at = now()
     WHERE token = $2 AND status = 'pending'
     RETURNING *`,
    [cleanName, token]
  );

  if (rows.length > 0) {
    return NextResponse.json({ state: "confirmed", confirmedName: rows[0].confirmed_name });
  }

  // Não confirmou — descobre por quê para dar um retorno claro.
  const existing = await query<InviteLink>(`SELECT * FROM invite_links WHERE token = $1`, [token]);
  const link = existing[0];
  if (!link) return NextResponse.json({ state: "not_found" }, { status: 404 });
  if (link.status === "confirmed") {
    return NextResponse.json({ state: "confirmed", confirmedName: link.confirmed_name });
  }
  return NextResponse.json({ state: link.status }, { status: 409 });
}
