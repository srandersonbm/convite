import type { Metadata } from "next";
import { isAdminAuthed } from "@/lib/require-admin";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Administração · Convite" };

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}
