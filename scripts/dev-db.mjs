// Sobe um servidor Postgres local (via PGlite, em memória/arquivo) para
// desenvolvimento e testes, sem precisar instalar/configurar Postgres real.
// Fala o protocolo wire do Postgres de verdade, então o driver `pg` conecta
// normalmente — o mesmo código roda contra Neon em produção.
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import path from "node:path";

const PORT = Number(process.env.DEV_DB_PORT || 55432);
const dataDir = path.resolve(import.meta.dirname, "..", ".dev-data", "pgdata");

const db = new PGlite(dataDir);
await db.waitReady;

const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1", maxConnections: 10 });
await server.start();

console.log(`[dev-db] Postgres (PGlite) ouvindo em 127.0.0.1:${PORT}`);
console.log(`[dev-db] DATABASE_URL=postgres://postgres:postgres@127.0.0.1:${PORT}/postgres`);

process.on("SIGINT", async () => {
  await server.stop();
  process.exit(0);
});
