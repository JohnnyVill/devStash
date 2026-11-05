import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Optional while generating the client; database commands require this URL.
    url: process.env.DATABASE_URL_UNPOOLED,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
