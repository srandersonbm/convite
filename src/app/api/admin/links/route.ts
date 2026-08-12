import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { query, type InviteLink } from "@/lib/db";
import { generateToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let label: unknown;
  try {
    const body = await req.json();
    label = body?.label;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (typeof label !== "string" || label.trim().length === 0) {
    return NextResponse.json({ error: "Informe o nome do convidado." }, { status: 400 });
  }
  const cleanLabel = label.trim().slice(0, 120);

  // Colisão de token é praticamente impossível (14 chars, alfabeto de 58),
  // mas tenta novamente por segurança.
  for (let i = 0; i < 5; i++) {
    const token = generateToken();
    try {
      const rows = await query<InviteLink>(
        `INSERT INTO invite_links (token, guest_label) VALUES ($1, $2) RETURNING *`,
        [token, cleanLabel]
      );
      return NextResponse.json({ link: rows[0] });
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr?.code === "23505") continue; // unique_violation, tenta outro token
      throw err;
    }
  }

  return NextResponse.json({ error: "Não foi possível gerar o link. Tente novamente." }, { status: 500 });
}
