import { Archive, Plus, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b bg-sidebar px-4 py-3 sm:flex-nowrap sm:px-6">
      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-3 rounded-md font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
        aria-label="DevStash dashboard"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Archive aria-hidden="true" className="size-5" />
        </span>
        DevStash
      </Link>
      <div className="relative order-last w-full sm:order-none sm:max-w-md sm:flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          aria-label="Search your stash"
          placeholder="Search your stash..."
          readOnly
          className="h-10 pl-9"
        />
      </div>
      <Button type="button" aria-disabled="true" className="ml-auto h-10 px-4">
        <Plus aria-hidden="true" />
        New item
      </Button>
    </header>
  );
}
