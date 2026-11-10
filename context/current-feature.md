# Current Feature

## Dashboard Collections

Specification: [Dashboard Collections Spec](features/dashboard-collections-spec.md).

## Status

Completed

## Goals

- Replace mock collection data in the dashboard main area with actual Neon database data using Prisma.
- Create `src/lib/db/collections.ts` with collection data fetching functions and fetch collections directly in a Server Component.
- Preserve the current design and six-card recent collections layout; reference `context/screenshots/dashboard-ui-main.png` if needed.
- Derive each collection card's border color from its most-used content type.
- Show small icons for all content types present in each collection.
- Update the collection stats display to use database data.
- Defer the items underneath the collections to a later feature.

## History

- 2026-11-10: Completed **Dashboard Collections** on `feature/dashboard-collections`. Added server-only Prisma collection queries scoped to a user, with up to six collections ordered by update time, grouped item/type counts, and total/favorite collection statistics. The dashboard Server Component fetches the seeded Demo User's collections at request time until authentication is implemented. Preserved the card grid, added dominant-type border colors and accessible type icons, and deferred the item sections underneath. The five seeded collections contain 18 items; the layout supports up to six cards without adding dummy records. Sidebar, profile, and item statistics remain mock-backed. Lint, production build (including TypeScript), read-only Neon count/type/empty-owner checks, and headless Chrome checks at 1440px, 390px, and 320px passed. No schema changes were needed.

- 2026-11-10: Selected **Dashboard Collections** as the current feature from [the dashboard collections specification](features/dashboard-collections-spec.md). Status: In Progress.

- 2026-11-05: Completed **Development and Demo Seed Data** on `feature/demo-seed`. Replaced the seed with transactional upserts for Demo User, seven system types with the specified icons/colors, five collections, and 18 sample items. Added `bcryptjs` password hashing with 12 rounds, current email verification, Free access without a subscription, stable fixture IDs, and checks that preserve unrelated owners and billing data. Added `prisma/seed-data.ts`, `npm run db:test:seed`, and updated development/production seed documentation. Seeded Neon and verified two seed runs preserve IDs/counts and unrelated records; final counts are one user, five demo collections, 18 items, and seven system types. Password, ownership, payload, and system metadata checks passed, along with lint, TypeScript, production build, migration status, and a headless Chrome dashboard render check. Dashboard remains mock-backed; no schema migration was needed.

- 2026-11-05: Selected **Development and Demo Seed Data** as the current feature from [the seed specification](features/seed-spec.md). Status: In Progress. Replacing the existing seed file is authorized.

- 2026-11-05: Archived **Prisma + Neon PostgreSQL Setup**. Status: Completed. Specification: [Database setup requirements](features/database-spec.md). Goals: set up Prisma 7 with Neon serverless PostgreSQL following the Prisma 7 guides; create the initial schema from the project overview with NextAuth models; add indexes and explicit deletion rules; separate Neon development and production branches; use versioned migrations, verify migration status, and deploy production migrations with `prisma migrate deploy`.

- 2026-11-05: Completed **Prisma + Neon PostgreSQL Setup** on `feature/neon-prisma`. Pinned Prisma CLI, client, and Neon adapter to 7.10.1; added the generated-client configuration, server-only singleton, initial domain and NextAuth schema, indexes, deletion rules, SQL type constraints, and an idempotent seven-type seed. Created the initial migration with `prisma migrate dev`, applied it to the configured Neon development database, and verified migration status is up to date. Neon adapter CRUD/rollback checks, SQL relation/constraint checks, repeat seeding, schema validation, lint, TypeScript, and production build passed; headless Chrome verified the dashboard renders. Added environment examples, database scripts, and development/production migration documentation. Dashboard data remains mock-backed; authentication flows are outside this setup feature.

- 2026-11-05: Started **Prisma + Neon PostgreSQL Setup** from [the database specification](features/database-spec.md). Status: In Progress.

- 2026-10-16: Archived **Dashboard UI Phase 3** — Build the dashboard main area using the existing mock data. Status: Completed. Specification: [Dashboard UI Phase 3](features/dashboard-phase-3-spec.md). Goals: main area to the right of the sidebar; recent collections; pinned items; 10 recent items; four stats cards for item count, collection count, favorite items, and favorite collections.

- 2026-10-16: Completed Dashboard UI Phase 3 on `feature/dashboard-phase-3`. Added recent collection cards, a pinned-items section, and up to 10 recently updated items alongside the four existing stats cards. Reused item cards and preserved search, collection/type filters, sorting, grid/list views, and mobile navigation. ESLint and production build passed. Chrome verified desktop and 390px/320px layouts and interactions; temporary render checks verified the newest-10 limit with 14 items and empty-workspace/no-pins states. Existing mock data remains unchanged and contains six items.

- 2026-10-16: Started Dashboard UI Phase 3 from [the phase 3 specification](features/dashboard-phase-3-spec.md).

- 2026-10-16: Archived **Dashboard UI Phase 2** — Build the dashboard sidebar and responsive drawer using the existing mock data. Status: Completed. Specification: [Dashboard UI Phase 2](features/dashboard-phase-2-spec.md). Goals: collapsible sidebar; item-type links to `/items/TYPE` (for example, `/items/snippets`); favorite and most recent collections; user avatar area at the bottom; drawer icon to open and close the sidebar; always use a drawer on mobile.

- 2026-10-16: Fixed the default home URL showing only the original DevStash placeholder by redirecting `/` to `/dashboard`. Verified the running development server returns a 307 redirect and the dashboard renders successfully. ESLint and production build passed.

- 2026-10-16: Completed Dashboard UI Phase 2 on `feature/dashboard-phase-2`. Added working `/items/TYPE` links and mock-backed type pages, recent collections ordered by item usage, and drawer cleanup on desktop resize. Preserved collapsible desktop navigation, favorite collections, and the bottom user area. ESLint and production build passed; headless Chrome verified desktop collapse/expand, mobile drawer navigation, Escape and focus restoration, responsive resizing, all seven type routes, and unknown-type 404 handling.

- 2026-10-16: Selected Dashboard UI Phase 2 as the current feature, following `context/features/dashboard-phase-2-spec.md`.

- 2026-10-16: Built screenshot-inspired dashboard shell on feature/dashboard-shell. Added desktop sidebar, accessible mobile drawer, user area, searchable mock item cards, statistics, sorting, and grid/list views. ESLint and production build passed; desktop and narrow layouts visually checked in headless Chrome. Uses local mock data; creation and persistence remain deferred.

- 2026-10-16: Implemented Dashboard UI Phase 1 on `feature/dashboard-phase-1`: initialized shadcn/ui, installed Button and Input, added `/dashboard` with a responsive dark shell, display-only top bar, and sidebar/main placeholders. Production build and ESLint passed; verified HTTP 200 and desktop/mobile layouts in headless Chrome.
- 2026-10-16: Started Dashboard UI Phase 1 from the phase 1 specification.
- 2026-10-16: Added typed dashboard mock data. Production build and ESLint passed. No UI changes were needed.
