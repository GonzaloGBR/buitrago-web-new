import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

/**
 * Con `prisma.config.ts`, el CLI no carga `.env` solo: cargamos `.env` y `.env.local`
 * para que `prisma validate` / `generate` encuentren `DATABASE_URL` como antes.
 */
loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local"), override: true });

/**
 * Sustituye `package.json#prisma` (deprecado).
 * La URL de la base sigue declarada en `schema.prisma` como `env("DATABASE_URL")`.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
});
