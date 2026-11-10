import "server-only";

import { prisma } from "@/lib/prisma";

export async function getRecentCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 6,
    select: { id: true, name: true, description: true, isFavorite: true },
  });
  const typeCounts = await prisma.item.groupBy({
    by: ["collectionId", "typeId"],
    where: { userId, collectionId: { in: collections.map(collection => collection.id) } },
    _count: { _all: true },
  });
  const types = await prisma.itemType.findMany({
    where: {
      id: { in: [...new Set(typeCounts.map(group => group.typeId))] },
      OR: [{ userId: null }, { userId }],
    },
    select: { id: true, name: true, icon: true, color: true },
  });
  return collections.map(collection => {
    const counts = typeCounts.filter(group => group.collectionId === collection.id);
    const contentTypes = counts.flatMap(group => {
      const type = types.find(type => type.id === group.typeId);
      return type ? [{ ...type, count: group._count._all }] : [];
    }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    return {
      ...collection,
      itemCount: counts.reduce((total, group) => total + group._count._all, 0),
      contentTypes,
    };
  });
}

export async function getCollectionStats(userId: string) {
  const [total, favorites] = await prisma.$transaction([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}
