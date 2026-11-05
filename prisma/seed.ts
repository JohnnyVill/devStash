import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { ContentKind, SystemType } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be configured before seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString, connectionTimeoutMillis: 15_000 }),
});

const systemTypes = [
  { systemKey: SystemType.SNIPPET, name: "Snippet", contentKind: ContentKind.TEXT, icon: "Code2" },
  { systemKey: SystemType.PROMPT, name: "Prompt", contentKind: ContentKind.TEXT, icon: "Sparkles" },
  { systemKey: SystemType.NOTE, name: "Note", contentKind: ContentKind.TEXT, icon: "StickyNote" },
  { systemKey: SystemType.COMMAND, name: "Command", contentKind: ContentKind.TEXT, icon: "Terminal" },
  { systemKey: SystemType.FILE, name: "File", contentKind: ContentKind.FILE, icon: "File" },
  { systemKey: SystemType.IMAGE, name: "Image", contentKind: ContentKind.FILE, icon: "Image" },
  { systemKey: SystemType.URL, name: "URL", contentKind: ContentKind.URL, icon: "Link" },
];

async function main() {
  await prisma.$transaction(
    systemTypes.map((type) => {
      const data = { ...type, normalizedName: type.name.toLowerCase(), userId: null };

      return prisma.itemType.upsert({
        where: { systemKey: type.systemKey },
        create: data,
        update: data,
      });
    }),
  );

  console.log("Seeded all seven system item types.");
}

main()
  .catch(() => {
    console.error("Database seed failed. Check the connection and migration status.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
