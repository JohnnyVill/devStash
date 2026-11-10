export interface DashboardItemType {
  name: string;
  icon: string | null;
  color: string | null;
  systemKey: string | null;
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  typeId: string;
  type?: DashboardItemType;
  collectionId: string | null;
  content: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}
