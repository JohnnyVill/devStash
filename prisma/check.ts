import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/lib/prisma";

const rollback = new Error("Rollback successful database check");

async function main() {
  const types = await prisma.itemType.findMany({ where: { userId: null } });
  assert.equal(types.length, 7, "Run db:seed to install all seven system types");
  const snippet = types.find((type) => type.systemKey === "SNIPPET");
  assert.ok(snippet, "Snippet type must exist");
  assert.equal(snippet.contentKind, "TEXT");

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: `database-check-${randomUUID()}@example.invalid` },
      });
      const collection = await tx.collection.create({
        data: { name: "Database check", userId: user.id },
      });
      const item = await tx.item.create({
        data: {
          title: "Database check",
          content: "Initial content",
          userId: user.id,
          typeId: snippet.id,
          collectionId: collection.id,
        },
      });
      await tx.item.update({ where: { id: item.id }, data: { content: "Updated content" } });
      const saved = await tx.item.findUniqueOrThrow({ where: { id: item.id } });
      assert.equal(saved.content, "Updated content");
      await tx.collection.delete({ where: { id: collection.id } });
      const inboxItem = await tx.item.findUniqueOrThrow({ where: { id: item.id } });
      assert.equal(inboxItem.collectionId, null);
      await tx.user.delete({ where: { id: user.id } });
      assert.equal(await tx.item.count({ where: { id: item.id } }), 0);
      throw rollback;
    }, { timeout: 30_000 });
  } catch (error) {
    if (error !== rollback) throw error;
  }

  console.log("Neon adapter verified: seeded types, CRUD, Inbox behavior, cascades, and rollback.");
}

main()
  .catch(() => {
    console.error("Database check failed. Verify connection settings, migrations, and seed data.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
