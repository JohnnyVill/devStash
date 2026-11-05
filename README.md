DevStash is a developer knowledge hub built with Next.js, Neon PostgreSQL, and Prisma 7.

## Database setup

Use Node.js 22.12+ or 24 LTS and npm. Prisma CLI, client, and Neon adapter are pinned together at 7.10.1. Do not upgrade them independently or install an unversioned Prisma major.

1. Run `npm install`. The postinstall script generates the Prisma client in `src/generated/prisma`; generated files are ignored by Git.
2. Create a development branch in your Neon project, separate from production.
3. Copy `.env.example` to `.env` in the project root. Copy the development branch's pooled connection string into `DATABASE_URL` and its direct connection string into `DATABASE_URL_UNPOOLED`. Keep both on the same branch. Never commit credentials.
4. Run `npm run db:migrate -- --name init` for a fresh setup, or `npm run db:migrate -- --name describe_change` after changing the schema. This creates/applies versioned SQL migrations; never use `db push` unless explicitly requested.
5. Run `npm run db:generate` and `npm run db:seed` explicitly. Prisma 7 does not automatically generate the client or seed after `migrate dev`. The seed upserts all seven built-in item types and can be rerun safely.
6. Run `npm run db:status` before committing. Commit the schema and migration files together.

Run `npm run db:check` after seeding to verify the Neon adapter, seeded types, item CRUD, collection deletion, and user cascades. Run `npm run db:test:relations` to verify SQL constraints and relation deletion behavior. Use an isolated development/test branch: both checks roll back their test records. Lint and build with `npm run lint` and `npm run build`.

`migrate dev` uses a disposable shadow database to detect drift. If the Neon role cannot create databases, set `SHADOW_DATABASE_URL` to a separate disposable database's direct connection string. Never use the development or production database as the shadow database. If Prisma reports drift or asks to reset an existing database, investigate before accepting a reset.

Prisma 7 loads CLI environment variables explicitly through `dotenv/config` in `prisma.config.ts`; keep database settings in root `.env` or supply them through the process environment. Next.js loads root `.env` automatically. Database URLs live in the config and runtime adapter, not the schema. `DATABASE_URL_UNPOOLED` is optional for client generation/builds, but required for database CLI commands.

Server code imports `prisma` from `@/lib/prisma`. It uses the Neon driver adapter with a small connection pool and a development singleton for hot reloads. The `server-only` guard prevents accidental imports into client components. Standalone seeds instantiate their own client and disconnect on completion.

The initial schema follows `context/project-overview.md`: users, items, types, collections, tags, subscriptions, Stripe webhook deduplication, and NextAuth account/session/verification-token tables. Collection deletion moves items to Inbox; item/tag joins and auth records cascade with their parent; referenced types cannot be deleted. Application services must still enforce ownership, payload validation, and entitlements. Account deletion must remove items before custom types, and separately clean up stored objects/billing. Authentication flows and replacing dashboard mock data are subsequent features.

## Production migrations

Set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` to the production branch only in the production environment. Run `npm run db:deploy` as a release step before starting the new application version, then `npm run db:seed` when initializing system types. Use `npm run build` to generate the client and build Next.js. Never run `migrate dev` against production. Development and production apply the same checked-in migration history.

References: [Prisma 7 upgrade guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7), [Neon and Prisma](https://neon.com/docs/guides/prisma), [Auth.js Prisma schema](https://authjs.dev/getting-started/adapters/prisma).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
