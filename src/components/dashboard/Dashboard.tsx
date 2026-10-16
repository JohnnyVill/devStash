"use client";

import { useEffect, useRef, useState } from "react";
import { Archive, Boxes, Clock3, Code2, File, Image, Inbox, LayoutGrid, Link2, List, PanelLeft, Pin, Plus, Search, Sparkles, Star, StickyNote, Terminal, X, type LucideIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import Link from "next/link";
import { COLLECTIONS, CURRENT_USER, ITEMS, ITEM_TYPES, type Item } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ICONS: Record<string, LucideIcon> = { snippet: Code2, prompt: Sparkles, note: StickyNote, command: Terminal, file: File, image: Image, url: Link2 };
const COLORS: Record<string, string> = { snippet: "border-blue-400/60 text-blue-400", prompt: "border-yellow-400/60 text-yellow-400", note: "border-violet-400/60 text-violet-400", command: "border-cyan-400/60 text-cyan-400", file: "border-emerald-400/60 text-emerald-400", image: "border-orange-400/60 text-orange-400", url: "border-pink-400/60 text-pink-400" };

// Collections do not have usage timestamps; use their most recently used item.
const recentCollections = COLLECTIONS.map(collection => ({
  ...collection,
  lastUsedAt: ITEMS.filter(item => item.collectionId === collection.id)
    .reduce((latest, item) => (item.lastUsedAt ?? "") > latest ? item.lastUsedAt! : latest, ""),
})).filter(collection => collection.lastUsedAt)
  .sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt));

interface NavigationEntry {
  id: string;
  name: string;
  icon: LucideIcon;
  count?: number;
  href?: string;
}

interface SidebarProps { filter: string; onSelect: (filter: string) => void }
function Sidebar({ filter, onSelect }: SidebarProps) {
  const groups: { title: string; entries: NavigationEntry[] }[] = [
    { title: "Workspace", entries: [{ id: "all", name: "All items", icon: Boxes, count: ITEMS.length }, { id: "inbox", name: "Inbox", icon: Inbox, count: ITEMS.filter(i => !i.collectionId).length }, { id: "favorites", name: "Favorites", icon: Star, count: ITEMS.filter(i => i.isFavorite).length }, { id: "recent", name: "Recently used", icon: Clock3 }] },
    { title: "Favorite collections", entries: COLLECTIONS.filter(c => c.isFavorite).map(c => ({ ...c, icon: Star })) },
    { title: "Recent collections", entries: recentCollections.map(c => ({ ...c, icon: Clock3, count: ITEMS.filter(i => i.collectionId === c.id).length })) },
    { title: "Types", entries: ITEM_TYPES.map(t => ({ id: t.id, name: `${t.name}s`, icon: ICONS[t.id], href: `/items/${t.name.toLowerCase()}s`, count: ITEMS.filter(item => item.typeId === t.id).length })) },
  ];
  return <div className="flex h-full flex-col">
    <Link href="/dashboard" className="flex h-16 shrink-0 items-center gap-3 border-b px-5 text-sm font-semibold"><span className="flex size-8 items-center justify-center rounded-lg bg-primary"><Archive className="size-4" /></span>DevStash</Link>
    <nav aria-label="Workspace navigation" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">{groups.map(group => <div key={group.title}>{group.title !== "Workspace" && <h2 className="mb-2 px-3 text-[10px] tracking-widest text-muted-foreground uppercase">{group.title}</h2>}<div className="space-y-1">{group.entries.map(entry => {
      const className = `flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-ring ${filter === entry.id ? "bg-white/8 text-white" : "text-muted-foreground"}`;
      const content = <><entry.icon aria-hidden="true" className={`size-4 shrink-0 ${COLORS[entry.id] ?? ""}`} /><span className="flex-1 truncate">{entry.name}</span>{entry.count !== undefined && <span className="text-[10px] text-muted-foreground">{entry.count}</span>}</>;
      return entry.href ? <Link key={entry.id} href={entry.href} onClick={() => onSelect(entry.id)} aria-current={filter === entry.id ? "page" : undefined} className={className}>{content}</Link> : <button key={entry.id} onClick={() => onSelect(entry.id)} aria-current={filter === entry.id ? "page" : undefined} className={className}>{content}</button>;
    })}</div></div>)}</nav>
    <div className="flex items-center gap-3 border-t p-4"><Avatar /><div><p className="text-xs font-medium">{CURRENT_USER.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{CURRENT_USER.plan === "pro" ? "Pro" : "Free"} workspace</p></div></div>
  </div>;
}
function Avatar() { return <span aria-label={CURRENT_USER.name} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-semibold">{CURRENT_USER.initials}</span>; }

interface ItemCardProps { item: Item }
function ItemCard({ item }: ItemCardProps) {
  const Icon = ICONS[item.typeId];
  return <article className={`flex min-h-44 flex-col rounded-xl border bg-white/3 p-4 ${COLORS[item.typeId]}`}><div className="flex items-center justify-between"><span className="rounded-lg bg-current/10 p-2"><Icon className="size-4" /></span><span className="flex items-center gap-2">{item.isPinned && <Pin aria-label="Pinned" className="size-3 text-muted-foreground" />}<span aria-label={item.isFavorite ? "Favorite" : "Not a favorite"}><Star className={`size-4 ${item.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} /></span></span></div><h3 className="mt-4 text-xs font-semibold text-foreground">{item.title}</h3><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{item.description}</p><div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5"><div className="flex gap-1">{item.tags.map(tag => <span key={tag} className="rounded-md bg-white/5 px-2 py-1 text-[9px] text-muted-foreground">{tag}</span>)}</div><time dateTime={item.updatedAt} className="text-[9px] text-muted-foreground">{item.updatedAt.slice(0, 10)}</time></div></article>;
}

interface RecentCollectionsProps { onSelect: (id: string) => void }
function RecentCollections({ onSelect }: RecentCollectionsProps) {
  return (
    <section className="mt-9" aria-labelledby="collections-heading">
      <h2 id="collections-heading" className="mb-4 text-sm font-semibold">Recent collections</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {recentCollections.map(collection => {
          const items = ITEMS.filter(item => item.collectionId === collection.id);
          return (
            <button key={collection.id} onClick={() => onSelect(collection.id)} className="min-w-0 rounded-xl border bg-sidebar p-4 text-left transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-ring">
              <div className="flex items-center justify-between gap-3"><Archive aria-hidden="true" className="size-5 text-violet-400" />{collection.isFavorite && <Star aria-label="Favorite collection" className="size-4 fill-yellow-400 text-yellow-400" />}</div>
              <h3 className="mt-4 text-xs font-semibold">{collection.name}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{collection.description}</p>
              <p className="mt-4 text-[10px] text-muted-foreground">{items.length} {items.length === 1 ? "item" : "items"}</p>
            </button>
          );
        })}
      </div>
      {!recentCollections.length && <p className="rounded-xl border border-dashed p-6 text-xs text-muted-foreground">Your recently used collections will appear here.</p>}
    </section>
  );
}

interface DashboardProps { initialFilter?: string }

export function Dashboard({ initialFilter = "all" }: DashboardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [list, setList] = useState(false);
  const [sort, setSort] = useState("updated");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function handleKey(event: KeyboardEvent) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); } }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeDrawer = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", closeDrawer);
    return () => desktop.removeEventListener("change", closeDrawer);
  }, []);
  const select = (value: string) => { setFilter(value); setMobileOpen(false); };
  const visible = ITEMS.filter(item => {
    const matches = filter === "all" || (filter === "inbox" && !item.collectionId) || (filter === "favorites" && item.isFavorite) || (filter === "recent" && item.lastUsedAt) || item.typeId === filter || item.collectionId === filter;
    return matches && [item.title, item.description, item.content, ...item.tags].join(" ").toLowerCase().includes(query.toLowerCase());
  }).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : (filter === "recent" ? b.lastUsedAt ?? "" : b.updatedAt).localeCompare(filter === "recent" ? a.lastUsedAt ?? "" : a.updatedAt));
  const heading = ({ all: "All items", inbox: "Inbox", favorites: "Favorites", recent: "Recently used" } as Record<string, string>)[filter] ?? COLLECTIONS.find(c => c.id === filter)?.name ?? `${ITEM_TYPES.find(t => t.id === filter)?.name}s`;
  const overview = filter === "all" && !query.trim();
  const pinned = visible.filter(item => item.isPinned);
  const displayed = overview
    ? [...visible].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 10)
    : visible;
  if (overview && sort === "title") displayed.sort((a, b) => a.title.localeCompare(b.title));
  const itemGrid = list ? "grid gap-3" : "grid gap-3 lg:grid-cols-2 xl:grid-cols-3";
  const stats = [{ label: "Total items", value: ITEMS.length, icon: Boxes, caption: "In your workspace" }, { label: "Collections", value: COLLECTIONS.length, icon: Archive, caption: "Ideas, organized" }, { label: "Favorite items", value: ITEMS.filter(i => i.isFavorite).length, icon: Star, caption: "Always close at hand" }, { label: "Favorite collections", value: COLLECTIONS.filter(c => c.isFavorite).length, icon: Star, caption: "Your go-to collections" }];
  return <div className="flex min-h-dvh w-full min-w-0">
    <a href="#main-content" className="sr-only z-50 rounded bg-primary p-3 focus:not-sr-only focus:fixed">Skip to main content</a>
    {!collapsed && <aside id="desktop-sidebar" className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r bg-sidebar md:block"><Sidebar filter={filter} onSelect={select} /></aside>}
    <div className="min-w-0 flex-1">
      <header className="flex h-16 items-center gap-3 border-b px-4 sm:px-6">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} aria-controls={collapsed ? undefined : "desktop-sidebar"} className="hidden text-muted-foreground md:inline-flex"><PanelLeft /></Button>
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}><Dialog.Trigger asChild><Button variant="ghost" size="icon" aria-label="Open navigation" className="md:hidden"><PanelLeft /></Button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 md:hidden" /><Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72 max-w-[calc(100%-2rem)] border-r bg-sidebar md:hidden"><Dialog.Title className="sr-only">Workspace navigation</Dialog.Title><Dialog.Description className="sr-only">Browse items, collections, and types.</Dialog.Description><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close navigation" className="absolute top-4 right-3"><X /></Button></Dialog.Close><Sidebar filter={filter} onSelect={select} /></Dialog.Content></Dialog.Portal></Dialog.Root>
        <div className="relative max-w-md min-w-0 flex-1"><Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input ref={searchRef} type="search" placeholder="Search your stash..." aria-label="Search your stash" value={query} onChange={event => setQuery(event.target.value)} className="h-10 bg-white/3 pl-9 sm:pr-24" /><kbd className="pointer-events-none absolute top-3 right-3 hidden rounded border px-1 text-[10px] text-muted-foreground sm:block">Ctrl / ⌘ K</kbd></div><div className="ml-auto"><Avatar /></div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 py-9 outline-none sm:px-8 lg:px-12 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 text-[10px] font-medium tracking-[0.2em] text-violet-400 uppercase">Your workspace</p><h1 className="text-2xl font-semibold tracking-tight">Welcome back, {CURRENT_USER.name.split(" ")[0]}.</h1><p className="mt-2 text-xs text-muted-foreground">Keep your best ideas close at hand.</p></div><Button disabled title="Item creation is coming in a later phase"><Plus />New item</Button></div>
        <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">{stats.map(stat => <div key={stat.label} className="rounded-xl border bg-sidebar p-4"><div className="flex items-center justify-between text-[11px] text-muted-foreground">{stat.label}<stat.icon className="size-4" /></div><p className="mt-4 text-xl font-semibold">{stat.value}</p><p className="mt-1 text-[10px] text-muted-foreground">{stat.caption}</p></div>)}</div>
        {overview && <>
          <RecentCollections onSelect={select} />
          <section className="mt-9" aria-labelledby="pinned-heading">
            <h2 id="pinned-heading" className="mb-4 flex items-center gap-2 text-sm font-semibold"><Pin aria-hidden="true" className="size-4 text-violet-400" />Pinned items</h2>
            <div className={itemGrid}>{pinned.map(item => <ItemCard key={item.id} item={item} />)}</div>
            {!pinned.length && <p className="rounded-xl border border-dashed p-6 text-xs text-muted-foreground">Pinned items will appear here for quick access.</p>}
          </section>
        </>}
        <section className="mt-9" aria-labelledby="items-heading"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 id="items-heading" className="text-sm font-semibold">{overview ? "Recent items" : heading}</h2><p aria-live="polite" className="mt-1 text-[11px] text-muted-foreground">{displayed.length} {displayed.length === 1 ? "item" : "items"}{overview ? " - Most recently updated, up to 10" : " in your workspace"}</p></div><div className="flex items-center gap-2"><select aria-label="Sort items" value={sort} onChange={e => setSort(e.target.value)} className="h-8 rounded-lg border bg-sidebar px-2 text-[11px] text-muted-foreground"><option value="updated">Recently updated</option><option value="title">Title A–Z</option></select><div className="flex rounded-lg border p-0.5"><Button variant={list ? "ghost" : "secondary"} size="icon-sm" aria-label="Grid view" aria-pressed={!list} onClick={() => setList(false)}><LayoutGrid /></Button><Button variant={list ? "secondary" : "ghost"} size="icon-sm" aria-label="List view" aria-pressed={list} onClick={() => setList(true)}><List /></Button></div></div></div>
          <div className={itemGrid}>{displayed.map(item => <ItemCard key={item.id} item={item} />)}</div>
          {!visible.length && <div className="rounded-xl border border-dashed py-16 text-center"><Search className="mx-auto mb-3 size-6 text-muted-foreground" /><h3 className="text-sm font-medium">No items found</h3><p className="mt-2 text-xs text-muted-foreground">Try another search or choose a different collection.</p></div>}
        </section>
        <div className="mt-8 flex items-center gap-4 rounded-xl border border-violet-400/20 bg-violet-400/5 p-5"><Sparkles className="size-5 shrink-0 text-violet-400" /><div><h2 className="text-xs font-semibold">Make your stash work for you</h2><p className="mt-1 text-[11px] text-muted-foreground">Save a snippet, prompt, or note to start building your personal knowledge hub.</p></div></div>
      </main>
    </div>
  </div>;
}

