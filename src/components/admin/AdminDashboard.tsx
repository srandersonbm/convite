"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { EVENT } from "@/lib/content";

type Status = "pending" | "confirmed" | "revoked";

interface Guest {
  id: number;
  token: string;
  guest_label: string;
  status: Status;
  created_at: string;
  confirmed_name: string | null;
  confirmed_at: string | null;
}

const dateFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

const STATUS_LABEL: Record<Status, string> = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  revoked: "Revogado",
};

const STATUS_CLASS: Record<Status, string> = {
  pending: "bg-gold/20 text-gold-dark",
  confirmed: "bg-forest/15 text-forest",
  revoked: "bg-ink/10 text-ink/50",
};

function inviteUrl(token: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/c/${token}`;
}

export function AdminDashboard() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [busyToken, setBusyToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [groupedView, setGroupedView] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/guests");
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      setGuests(data.guests);
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    // Padrão de fetch-on-mount com flag de cancelamento (mesmo formato
    // recomendado pela doc do React) para não atualizar o estado se o
    // componente desmontar antes da resposta chegar.
    let ignore = false;
    (async () => {
      const res = await fetch("/api/admin/guests");
      if (ignore) return;
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      if (!ignore) setGuests(data.guests);
    })();
    return () => {
      ignore = true;
    };
  }, [router]);

  const counts = useMemo(() => {
    const list = guests ?? [];
    return {
      total: list.length,
      confirmed: list.filter((g) => g.status === "confirmed").length,
      pending: list.filter((g) => g.status === "pending").length,
    };
  }, [guests]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError(null);
    if (label.trim().length === 0) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error ?? "Não foi possível gerar o link.");
        setCreating(false);
        return;
      }
      const url = inviteUrl(data.link.token);
      setGuests((prev) => (prev ? [data.link, ...prev] : [data.link]));
      setLabel("");
      setCreating(false);
      const waUrl = `https://wa.me/?text=${encodeURIComponent(EVENT.whatsappMessageTemplate(url))}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch {
      setCreateError("Falha de conexão. Tente novamente.");
      setCreating(false);
    }
  }

  async function onRevoke(token: string) {
    setBusyToken(token);
    try {
      const res = await fetch(`/api/admin/links/${token}/revoke`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setGuests((prev) => prev?.map((g) => (g.token === token ? data.link : g)) ?? prev);
      }
    } finally {
      setBusyToken(null);
    }
  }

  async function onDelete(token: string) {
    if (!window.confirm("Excluir este convite revogado da lista? Essa ação não pode ser desfeita.")) {
      return;
    }
    setBusyToken(token);
    try {
      const res = await fetch(`/api/admin/links/${token}`, { method: "DELETE" });
      if (res.ok) {
        setGuests((prev) => prev?.filter((g) => g.token !== token) ?? prev);
      }
    } finally {
      setBusyToken(null);
    }
  }

  async function onCopy(token: string) {
    try {
      await navigator.clipboard.writeText(inviteUrl(token));
      setCopiedToken(token);
      setTimeout(() => setCopiedToken((t) => (t === token ? null : t)), 1800);
    } catch {
      // clipboard indisponível — ignora silenciosamente
    }
  }

  function onWhatsapp(token: string) {
    const url = inviteUrl(token);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(EVENT.whatsappMessageTemplate(url))}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const rowProps = { copiedToken, busyToken, onCopy, onWhatsapp, onRevoke, onDelete };

  return (
    <main className="min-h-svh bg-cream px-4 pb-24 pt-8 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-terracotta">Administração</p>
            <h1 className="font-display text-2xl text-ink sm:text-3xl">Lista de convidados</h1>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="rounded-full border border-ink/15 px-4 py-2 text-xs text-ink/60 transition hover:border-ink/30 hover:text-ink disabled:opacity-40"
            >
              {refreshing ? "Atualizando..." : "Atualizar"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-ink/15 px-4 py-2 text-xs text-ink/60 transition hover:border-ink/30 hover:text-ink"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-3 gap-2.5 sm:gap-3">
          <StatCard
            label="Confirmados"
            value={counts.confirmed}
            accent="text-forest"
            active={groupedView}
            onClick={() => setGroupedView((v) => !v)}
          />
          <StatCard label="Aguardando" value={counts.pending} accent="text-gold-dark" />
          <StatCard label="Total de links" value={counts.total} accent="text-ink" />
        </div>

        <form
          onSubmit={onCreate}
          className="mb-10 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-cream-2/60 p-5 sm:flex-row sm:items-center"
        >
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nome do convidado (ex: Maria e João)"
            className="w-full flex-1 rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm text-ink placeholder:text-ink/35 outline-none focus:border-forest"
          />
          <button
            type="submit"
            disabled={creating || label.trim().length === 0}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream transition hover:brightness-110 disabled:opacity-40"
          >
            {creating ? "Gerando..." : "Gerar link e abrir WhatsApp"}
          </button>
        </form>
        {createError && <p className="-mt-6 mb-8 text-xs text-terracotta">{createError}</p>}

        {guests === null ? (
          <p className="text-sm text-ink/40">Carregando...</p>
        ) : guests.length === 0 ? (
          <p className="text-sm text-ink/40">Nenhum convite gerado ainda.</p>
        ) : groupedView ? (
          <div className="flex flex-col gap-8">
            <GuestGroup
              title="Confirmados"
              guests={guests.filter((g) => g.status === "confirmed")}
              empty="Ninguém confirmou ainda."
              {...rowProps}
            />
            <GuestGroup
              title="Ainda faltam confirmar"
              guests={guests.filter((g) => g.status === "pending")}
              empty="Nenhum convite aguardando confirmação."
              {...rowProps}
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {guests.map((g) => (
              <GuestRow key={g.token} guest={g} {...rowProps} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

interface RowProps {
  copiedToken: string | null;
  busyToken: string | null;
  onCopy: (token: string) => void;
  onWhatsapp: (token: string) => void;
  onRevoke: (token: string) => void;
  onDelete: (token: string) => void;
}

function GuestGroup({
  title,
  guests,
  empty,
  ...rowProps
}: { title: string; guests: Guest[]; empty: string } & RowProps) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
        {title} <span className="text-ink/30">({guests.length})</span>
      </h2>
      {guests.length === 0 ? (
        <p className="text-sm text-ink/35">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {guests.map((g) => (
            <GuestRow key={g.token} guest={g} {...rowProps} />
          ))}
        </ul>
      )}
    </section>
  );
}

function GuestRow({
  guest: g,
  copiedToken,
  busyToken,
  onCopy,
  onWhatsapp,
  onRevoke,
  onDelete,
}: { guest: Guest } & RowProps) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium text-ink">{g.guest_label}</p>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_CLASS[g.status]}`}
          >
            {STATUS_LABEL[g.status]}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink/45">
          Criado em {dateFmt.format(new Date(g.created_at))}
          {g.status === "confirmed" && g.confirmed_at && (
            <>
              {" · "}confirmado por <span className="text-forest">{g.confirmed_name}</span> em{" "}
              {dateFmt.format(new Date(g.confirmed_at))}
            </>
          )}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {g.status !== "revoked" && (
          <button
            type="button"
            onClick={() => onCopy(g.token)}
            className="rounded-full border border-ink/15 px-3.5 py-2 text-xs text-ink/70 transition hover:border-ink/30"
          >
            {copiedToken === g.token ? "Copiado!" : "Copiar link"}
          </button>
        )}
        {g.status === "pending" && (
          <>
            <button
              type="button"
              onClick={() => onWhatsapp(g.token)}
              className="rounded-full bg-forest/10 px-3.5 py-2 text-xs font-medium text-forest transition hover:bg-forest/15"
            >
              WhatsApp
            </button>
            <button
              type="button"
              disabled={busyToken === g.token}
              onClick={() => onRevoke(g.token)}
              className="rounded-full px-3.5 py-2 text-xs text-terracotta transition hover:bg-terracotta/10 disabled:opacity-40"
            >
              Revogar
            </button>
          </>
        )}
        {g.status === "revoked" && (
          <button
            type="button"
            disabled={busyToken === g.token}
            onClick={() => onDelete(g.token)}
            className="rounded-full px-3.5 py-2 text-xs text-terracotta transition hover:bg-terracotta/10 disabled:opacity-40"
          >
            Excluir
          </button>
        )}
      </div>
    </li>
  );
}

function StatCard({
  label,
  value,
  accent,
  active,
  onClick,
}: {
  label: string;
  value: number;
  accent: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <p className={`font-display text-2xl ${accent}`}>{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-ink/45">{label}</p>
    </>
  );

  if (!onClick) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-cream-2/50 px-3 py-4 text-center sm:px-4">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-4 text-center transition sm:px-4 ${
        active ? "border-forest bg-forest/10" : "border-ink/10 bg-cream-2/50 hover:border-ink/25"
      }`}
    >
      {content}
    </button>
  );
}
