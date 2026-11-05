import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import type { Prisma } from "../src/generated/prisma/client";
import { DEMO_COLLECTIONS, DEMO_EMAIL, DEMO_PASSWORD, SYSTEM_TYPES } from "./seed-data";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be configured before seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString, connectionTimeoutMillis: 15_000 }),
});

async function seedCollections(tx: Prisma.TransactionClient, userId: string) {
  for (const collection of DEMO_COLLECTIONS) {
    const id = `demo-collection-${collection.key}`;
    const existing = await tx.collection.findUnique({ where: { id } });
    if (existing && existing.userId !== userId) throw new Error("Seed collection belongs to another user.");
    const data = { name: collection.name, description: collection.description, userId };
    await tx.collection.upsert({ where: { id }, create: { id, ...data }, update: data });

    for (const item of collection.items) {
      const itemId = `demo-item-${item.key}`;
      const existingItem = await tx.item.findUnique({ where: { id: itemId } });
      if (existingItem && existingItem.userId !== userId) throw new Error("Seed item belongs to another user.");
      const type = await tx.itemType.findUniqueOrThrow({ where: { systemKey: item.type } });
      const itemData = {
        title: item.title, description: item.description, content: item.content ?? null,
        url: item.url ?? null, language: item.language ?? null,
        typeId: type.id, collectionId: id, userId,
      };
      await tx.item.upsert({ where: { id: itemId }, create: { id: itemId, ...itemData }, update: itemData });
    }
  }
}

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 12);

  await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({ where: { email: DEMO_EMAIL }, include: { subscription: true } });
    if (existingUser?.subscription) throw new Error("Demo user already has billing data; seed will not change it.");

    for (const type of SYSTEM_TYPES) {
      const data = { ...type, normalizedName: type.name, userId: null };
      await tx.itemType.upsert({
        where: { systemKey: type.systemKey }, create: data, update: data,
      });
    }

    const data = { name: "Demo User", passwordHash, emailVerified: new Date() };
    const user = await tx.user.upsert({
      where: { email: DEMO_EMAIL }, create: { email: DEMO_EMAIL, ...data }, update: data,
    });
    await seedCollections(tx, user.id);
  }, { timeout: 60_000 });

  console.log("Seeded Demo User, 7 system types, 5 collections, and 18 items.");
}

main()
  .catch(() => {
    console.error("Database seed failed. Check the connection and migration status.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
