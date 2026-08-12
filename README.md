# Convite — 50 anos da Alessandra Barbosa

Site de convite (Next.js 16 + Postgres) para os 50 anos da Alessandra, com:

- Página principal com fotos, contagem regressiva, local (Damata Restaurante & Cachaçaria) e mapa.
- Link individual por convidado (`/c/<token>`) que expira assim que a presença é confirmada.
- Painel administrativo protegido por senha (`/admin`) para gerar links, abrir o WhatsApp já com a mensagem pronta, e ver a lista de confirmados.

Todo o conteúdo do convite (textos, data, endereço) fica centralizado em [`src/lib/content.ts`](src/lib/content.ts) — edite esse arquivo para ajustar qualquer texto sem mexer no resto do código.

## Rodando localmente

Requisitos: Node.js 20+.

```bash
npm install

# 1) sobe um Postgres local (não precisa instalar nada, roda em memória/arquivo)
npm run dev:db

# 2) em outro terminal, sobe o site
npm run dev
```

Crie um arquivo `.env.local` (veja `.env.example`) com:

```
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:55432/postgres
ADMIN_PASSWORD=uma-senha-de-teste
```

Acesse `http://localhost:3000`. O painel fica em `/admin`.

## Deploy em produção

Veja o guia completo em [`DEPLOY.md`](DEPLOY.md).
