import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { connection } from "next/server";
import { RecentCollections } from "@/components/dashboard/RecentCollections";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { prisma } from "@/lib/prisma";
import { getItems } from "@/lib/db/items";

export const metadata: Metadata = { title: "Dashboard | DevStash" };

export default async function DashboardPage() {
  await connection();
  // Temporary demo workspace until authentication supplies the current user ID.
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" }, select: { id: true },
  });
  const [collections, collectionStats, items] = user
    ? await Promise.all([getRecentCollections(user.id), getCollectionStats(user.id), getItems(user.id)])
    : [[], { total: 0, favorites: 0 }, []];

  return <Dashboard items={items} collectionStats={collectionStats} collectionSection={<RecentCollections collections={collections} />} />;
}
