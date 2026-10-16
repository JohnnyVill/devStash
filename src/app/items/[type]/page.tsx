import { notFound } from "next/navigation";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { ITEM_TYPES } from "@/lib/mock-data";

export function generateStaticParams() {
  return ITEM_TYPES.map(type => ({ type: `${type.name.toLowerCase()}s` }));
}

export default async function ItemTypePage({ params }: PageProps<"/items/[type]">) {
  const { type } = await params;
  const itemType = ITEM_TYPES.find(item => `${item.name.toLowerCase()}s` === type);

  if (!itemType) notFound();

  return <Dashboard key={itemType.id} initialFilter={itemType.id} />;
}
