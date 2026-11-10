import "server-only";

import { prisma } from "@/lib/prisma";
import type { DashboardItem } from "@/types/items";

// Keep the workspace dataset available to the existing client-side search and filters.
export async function getItems(userId: string): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      id: true, title: true, description: true, content: true,
      typeId: true, collectionId: true, isFavorite: true, isPinned: true,
      createdAt: true, updatedAt: true, lastUsedAt: true,
      type: { select: { name: true, icon: true, color: true, systemKey: true } },
      tags: {
        where: { tag: { userId } },
        select: { tag: { select: { name: true } } },
        orderBy: { tag: { name: "asc" } },
      },
    },
  });

  return items.map(item => ({
    ...item,
    description: item.description ?? "",
    content: item.content ?? "",
    tags: item.tags.map(({ tag }) => tag.name),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    lastUsedAt: item.lastUsedAt?.toISOString() ?? null,
  }));
}
