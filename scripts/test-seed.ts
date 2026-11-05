import "dotenv/config";

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { PrismaNeon } from "@prisma/adapter-neon";
import { compare, getRounds } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEMO_COLLECTIONS, DEMO_EMAIL, DEMO_PASSWORD, SYSTEM_TYPES } from "../prisma/seed-data";

const connectionString = process.env.DATABASE_URL;
assert.ok(connectionString, "Set DATABASE_URL before testing the seed");
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString, connectionTimeoutMillis: 15_000 }) });
const runFile = promisify(execFile);

async function verifySeed() {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_EMAIL },
    include: { subscription: true, collections: { include: { items: { include: { type: true } } } } },
  });
  assert.equal(user.name, "Demo User");
  assert.equal(user.subscription, null, "Demo account must have Free access");
  assert.ok(user.passwordHash);
  assert.equal(getRounds(user.passwordHash), 12);
  assert.ok(await compare(DEMO_PASSWORD, user.passwordHash));
  assert.ok(user.emailVerified && Math.abs(Date.now() - user.emailVerified.getTime()) < 86_400_000);

  const types = await prisma.itemType.findMany({ where: { systemKey: { not: null } } });
  assert.equal(types.length, 7);
  for (const expected of SYSTEM_TYPES) {
    const type = types.find((candidate) => candidate.systemKey === expected.systemKey);
    assert.ok(type);
    assert.equal(type.userId, null);
    for (const key of ["name", "contentKind", "icon", "color"] as const) assert.equal(type[key], expected[key]);
  }

  const seeded = user.collections.filter((collection) => collection.id.startsWith("demo-collection-"));
  assert.equal(seeded.length, 5);
  assert.equal(seeded.flatMap((collection) => collection.items).length, 18);
  for (const expected of DEMO_COLLECTIONS) {
    const collection = seeded.find((candidate) => candidate.id === `demo-collection-${expected.key}`);
    assert.ok(collection);
    assert.equal(collection.description, expected.description);
    assert.equal(collection.items.length, expected.items.length);
    for (const item of collection.items) {
      assert.equal(item.userId, user.id);
      assert.equal(item.type.userId, null);
      if (item.type.contentKind === "URL") {
        assert.ok(item.url && ["https:", "http:"].includes(new URL(item.url).protocol));
        assert.equal(item.content, null);
      } else {
        assert.ok(item.content?.trim());
        assert.equal(item.url, null);
      }
    }
  }
  const react = seeded.find((collection) => collection.name === "React Patterns");
  assert.ok(react?.items.every((item) => item.language === "typescript" && item.type.systemKey === "SNIPPET"));
  return [user.id, ...seeded.map((collection) => collection.id), ...seeded.flatMap((collection) => collection.items.map((item) => item.id))].sort();
}

async function main() {
  const fixture = await prisma.user.create({
    data: { email: `seed-check-${randomUUID()}@example.invalid`, name: "Preserve this user",
      collections: { create: { name: "Preserve this collection" } } },
    include: { collections: true },
  });
  try {
    await runFile(process.execPath, ["--import", "tsx", "prisma/seed.ts"]);
    const first = await verifySeed();
    const counts = await Promise.all([prisma.user.count(), prisma.collection.count(), prisma.item.count()]);
    await runFile(process.execPath, ["--import", "tsx", "prisma/seed.ts"]);
    assert.deepEqual(await verifySeed(), first, "Reruns must preserve seed record IDs");
    assert.deepEqual(await Promise.all([prisma.user.count(), prisma.collection.count(), prisma.item.count()]), counts);
    const preserved = await prisma.user.findUniqueOrThrow({ where: { id: fixture.id }, include: { collections: true } });
    assert.deepEqual(preserved, fixture, "Seed must preserve unrelated data");
    console.log("Seed verified: bcrypt (12 rounds), Free demo user, 7 system types, 5 collections, 18 items, rerun stability, and unrelated data preservation.");
  } finally {
    await prisma.user.delete({ where: { id: fixture.id } });
  }
}

main().catch(() => {
  console.error("Seed verification failed. Check the seed specification, database connection, and migrations.");
  process.exitCode = 1;
}).finally(async () => { await prisma.$disconnect(); });
