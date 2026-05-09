# Despliegue Buitrago Web

## Variables de entorno

Copiá `.env.example` a `.env.local` (desarrollo) o configurá las mismas claves en el panel de Hostinger / tu PaaS.

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Cadena MySQL de Prisma (Hostinger MySQL remoto en producción). |
| `ADMIN_PASSWORD` | Contraseña del login en `/admin/login`. |
| `ADMIN_SESSION_SECRET` | Secreto HS256 (mín. 16 caracteres) para la cookie de sesión. |
| `R2_*` | Opcional: si están definidas, las subidas del admin van a R2; si no, a `public/uploads`. |
| `R2_PUBLIC_HOST` | Solo build: hostname permitido en `next.config.ts` para `next/image` con URLs de R2. |

## Build

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

Si `migrate deploy` falla en tu hosting por permisos de base sombra, podés aplicar el SQL inicial en `prisma/migrations/20260509000000_init/migration.sql` manualmente una sola vez y luego usar `migrate deploy` en releases siguientes, o usar `prisma db push` solo en entornos controlados.

En el primer despliegue, ejecutá migraciones contra la base remota y, si aplica, `npm run db:seed` desde un entorno con `.env.local` apuntando a producción (solo si querés datos iniciales).

## Hostinger

1. Creá la base MySQL en el panel y obtené host, usuario, contraseña y nombre de BD.
2. `DATABASE_URL` con SSL si el proveedor lo exige (añadí `?sslaccept=strict` según documentación Hostinger).
3. Subí el código o conectá Git; comando de build: `npm run build`, inicio: `npm start`, versión Node LTS.
4. Definí las variables de entorno en el panel (no commitees `.env.local`).

## Cloudflare R2

1. Creá un bucket y una API token con permisos de lectura/escritura.
2. `R2_ENDPOINT`: URL S3-compatible de tu cuenta.
3. `R2_PUBLIC_URL`: dominio público (R2 custom domain o ruta pública) donde se sirven los objetos.
4. CORS del bucket: permití `PUT` y `GET` desde tu dominio si usás subida directa con URLs firmadas (`src/lib/r2-presign.ts`). El panel actual sube por Server Action al servidor, que hace `PutObject` a R2 (no requiere CORS del navegador a R2).

## Docker (solo desarrollo)

```bash
docker compose up -d
cp .env.example .env.local
# Ajustá DATABASE_URL al puerto 3307 como en el ejemplo
npm run db:push
npm run db:seed
npm run dev
```
