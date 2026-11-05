import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Set DATABASE_URL in the root .env file before testing.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString, connectionTimeoutMillis: 15_000 }),
  });

  try {
    const result = await prisma.$queryRaw<{ connected: number }[]>`SELECT 1 AS connected`;
    assert.equal(result[0]?.connected, 1);

    const [users, items, itemTypes] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.itemType.count(),
    ]);

    console.log("Database connection successful.");
    console.table({ users, items, itemTypes });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error("Database test failed. Check DATABASE_URL and ensure migrations are applied.");
  process.exitCode = 1;
});
