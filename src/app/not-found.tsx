import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.35em] text-terracotta">404</p>
      <h1 className="font-display mt-3 text-3xl text-ink">Página não encontrada</h1>
      <p className="mt-3 max-w-sm text-sm text-ink/55">
        O endereço acessado não existe ou o link do convite pode estar incompleto.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition hover:brightness-110"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
