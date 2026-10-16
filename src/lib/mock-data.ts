export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  plan: "free" | "pro";
  storageUsedBytes: number;
  storageLimitBytes: number;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  contentKind: "TEXT" | "FILE" | "URL";
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  isFavorite: boolean;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  typeId: string;
  collectionId: string | null;
  content: string;
  url?: string;
  language?: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

// All records belong to this mock workspace. Counts can be derived from ITEMS.
export const CURRENT_USER: User = {
  id: "user-jordan",
  name: "Jordan Davis",
  email: "dev@devstash.io",
  initials: "JD",
  plan: "free",
  storageUsedBytes: 1_900_000_000,
  storageLimitBytes: 5_000_000_000,
};

export const ITEM_TYPES: ItemType[] = [
  {
    id: "snippet",
    name: "Snippet",
    icon: "Code2",
    color: "#3b82f6",
    contentKind: "TEXT",
  },
  {
    id: "prompt",
    name: "Prompt",
    icon: "Sparkles",
    color: "#eab308",
    contentKind: "TEXT",
  },
  {
    id: "note",
    name: "Note",
    icon: "StickyNote",
    color: "#a78bfa",
    contentKind: "TEXT",
  },
  {
    id: "command",
    name: "Command",
    icon: "Terminal",
    color: "#06b6d4",
    contentKind: "TEXT",
  },
  {
    id: "file",
    name: "File",
    icon: "File",
    color: "#10b981",
    contentKind: "FILE",
  },
  {
    id: "image",
    name: "Image",
    icon: "Image",
    color: "#f97316",
    contentKind: "FILE",
  },
  {
    id: "url",
    name: "Link",
    icon: "Link",
    color: "#ec4899",
    contentKind: "URL",
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "react-patterns",
    name: "React Patterns",
    description: "Reusable React patterns and notes.",
    color: "#a78bfa",
    isFavorite: true,
  },
  {
    id: "ai-prompts",
    name: "AI Prompts",
    description: "Prompts for everyday development tasks.",
    color: "#eab308",
    isFavorite: false,
  },
  {
    id: "terminal-commands",
    name: "Terminal Commands",
    description: "Useful commands for local development.",
    color: "#06b6d4",
    isFavorite: false,
  },
  {
    id: "reading-list",
    name: "Reading List",
    description: "Articles and references to revisit.",
    color: "#ec4899",
    isFavorite: false,
  },
];

export const ITEMS: Item[] = [
  {
    id: "react-server-components",
    title: "React Server Components",
    description:
      "A practical checklist for deciding when to use server and client components.",
    typeId: "note",
    collectionId: "react-patterns",
    content:
      "Use Server Components for data fetching and server-only logic. Use Client Components for state, event handlers, and browser APIs.",
    tags: ["react", "nextjs"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-10-10T09:00:00Z",
    updatedAt: "2026-10-16T15:00:00Z",
    lastUsedAt: "2026-10-16T15:00:00Z",
  },
  {
    id: "review-pr-security",
    title: "Review PR for security issues",
    description:
      "Review this pull request for auth, validation, and data exposure risks.",
    typeId: "prompt",
    collectionId: "ai-prompts",
    content:
      "Review the following pull request for authentication, authorization, input validation, and data exposure risks. Explain each finding and suggest a fix.\n\n[Paste diff here]",
    tags: ["code-review", "security"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-10-12T09:00:00Z",
    updatedAt: "2026-10-15T12:00:00Z",
    lastUsedAt: "2026-10-15T12:00:00Z",
  },
  {
    id: "docker-compose-up",
    title: "Docker compose up",
    description:
      "Start local services in the background and rebuild changed images.",
    typeId: "command",
    collectionId: "terminal-commands",
    content: "docker compose up -d --build",
    language: "bash",
    tags: ["docker", "local-dev"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-10-10T09:00:00Z",
    updatedAt: "2026-10-13T10:00:00Z",
    lastUsedAt: "2026-10-13T10:00:00Z",
  },
  {
    id: "use-debounce-hook",
    title: "useDebounce hook",
    description:
      "A small, typed debounce hook for search inputs and expensive requests.",
    typeId: "snippet",
    collectionId: "react-patterns",
    content:
      'import { useEffect, useState } from "react";\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}',
    language: "typescript",
    tags: ["hooks", "typescript"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-10-12T09:00:00Z",
    updatedAt: "2026-10-12T09:00:00Z",
    lastUsedAt: null,
  },
  {
    id: "the-changelog",
    title: "The Changelog",
    description:
      "Product updates, engineering notes, and thoughtful writing from Linear.",
    typeId: "url",
    collectionId: "reading-list",
    content: "",
    url: "https://linear.app/changelog",
    tags: ["inspiration"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-10-09T09:00:00Z",
    updatedAt: "2026-10-09T09:00:00Z",
    lastUsedAt: null,
  },
  {
    id: "api-error-handling",
    title: "API error handling",
    description:
      "Patterns for returning consistent errors from route handlers.",
    typeId: "snippet",
    collectionId: null,
    content:
      'return Response.json(\n  { error: { code: "NOT_FOUND", message: "Item not found." } },\n  { status: 404 },\n);',
    language: "typescript",
    tags: ["api", "nextjs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-10-09T08:00:00Z",
    updatedAt: "2026-10-09T08:00:00Z",
    lastUsedAt: "2026-10-09T10:00:00Z",
  },
];
