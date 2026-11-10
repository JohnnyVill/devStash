import { Archive, Code, Code2, File, Image, Link, Link2, Sparkles, Star, StickyNote, Terminal, type LucideIcon } from "lucide-react";
import type { getRecentCollections } from "@/lib/db/collections";

const ICONS: Record<string, LucideIcon> = { Code, Code2, File, Image, Link, Link2, Sparkles, StickyNote, Terminal };
const COLORS: Record<string, string> = {
  "#3b82f6": "border-blue-500/60 text-blue-500",
  "#8b5cf6": "border-violet-500/60 text-violet-500",
  "#f97316": "border-orange-500/60 text-orange-500",
  "#fde047": "border-yellow-300/60 text-yellow-300",
  "#6b7280": "border-gray-500/60 text-gray-500",
  "#ec4899": "border-pink-500/60 text-pink-500",
  "#10b981": "border-emerald-500/60 text-emerald-500",
};

interface RecentCollectionsProps {
  collections: Awaited<ReturnType<typeof getRecentCollections>>;
}

export function RecentCollections({ collections }: RecentCollectionsProps) {
  return <section className="mt-9" aria-labelledby="collections-heading">
    <h2 id="collections-heading" className="mb-4 text-sm font-semibold">Recent collections</h2>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {collections.map(collection => <article key={collection.id} className={`min-w-0 rounded-xl border bg-sidebar p-4 ${COLORS[collection.contentTypes[0]?.color ?? ""] ?? "border-border text-muted-foreground"}`}>
        <div className="flex items-center justify-between gap-3"><Archive aria-hidden="true" className="size-5" />{collection.isFavorite && <Star aria-label="Favorite collection" className="size-4 fill-yellow-400 text-yellow-400" />}</div>
        <h3 className="mt-4 text-xs font-semibold text-foreground">{collection.name}</h3>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{collection.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">{collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}</p>
          <div className="flex flex-wrap gap-2">{collection.contentTypes.map(type => {
            const Icon = ICONS[type.icon ?? ""] ?? File;
            return <span key={type.id} title={type.name} className={COLORS[type.color ?? ""] ?? "text-muted-foreground"}><Icon aria-hidden="true" className="size-3.5" /><span className="sr-only">{type.name}</span></span>;
          })}</div>
        </div>
      </article>)}
    </div>
    {!collections.length && <p className="rounded-xl border border-dashed p-6 text-xs text-muted-foreground">Your recent collections will appear here.</p>}
  </section>;
}
