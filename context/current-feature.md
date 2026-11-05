# Current Feature

## Status

## Goals

## History

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
