import { ContentKind, SystemType } from "../src/generated/prisma/enums";

interface SeedItem {
  key: string;
  title: string;
  type: SystemType;
  description: string;
  content?: string;
  url?: string;
  language?: string;
}

interface SeedCollection {
  key: string;
  name: string;
  description: string;
  items: SeedItem[];
}

export const DEMO_EMAIL = "demo@devstash.io";
export const DEMO_PASSWORD = "12345678";

export const SYSTEM_TYPES = [
  { systemKey: SystemType.SNIPPET, name: "snippet", contentKind: ContentKind.TEXT, icon: "Code", color: "#3b82f6" },
  { systemKey: SystemType.PROMPT, name: "prompt", contentKind: ContentKind.TEXT, icon: "Sparkles", color: "#8b5cf6" },
  { systemKey: SystemType.COMMAND, name: "command", contentKind: ContentKind.TEXT, icon: "Terminal", color: "#f97316" },
  { systemKey: SystemType.NOTE, name: "note", contentKind: ContentKind.TEXT, icon: "StickyNote", color: "#fde047" },
  { systemKey: SystemType.FILE, name: "file", contentKind: ContentKind.FILE, icon: "File", color: "#6b7280" },
  { systemKey: SystemType.IMAGE, name: "image", contentKind: ContentKind.FILE, icon: "Image", color: "#ec4899" },
  { systemKey: SystemType.URL, name: "link", contentKind: ContentKind.URL, icon: "Link", color: "#10b981" },
];

export const DEMO_COLLECTIONS: SeedCollection[] = [
  {
    key: "react-patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        key: "use-debounce", title: "useDebounce hook", type: SystemType.SNIPPET,
        description: "Delay updating a value until input settles; cancel the previous timer on changes.",
        language: "typescript",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}`,
      },
      {
        key: "context-provider", title: "Typed Context provider", type: SystemType.SNIPPET,
        description: "Create a context with a consumer hook that checks the provider is present.",
        language: "typescript",
        content: `import { createContext, createElement, useContext, type ReactNode } from "react";

interface Workspace { name: string }
const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({ value, children }: { value: Workspace; children: ReactNode }) {
  return createElement(WorkspaceContext.Provider, { value }, children);
}

export function useWorkspace(): Workspace {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) throw new Error("WorkspaceProvider is required");
  return workspace;
}`,
      },
      {
        key: "unique-by", title: "Deduplicate records by key", type: SystemType.SNIPPET,
        description: "Keep the first record for each selected key while preserving input order.",
        language: "typescript",
        content: `export function uniqueBy<T, K>(items: readonly T[], getKey: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}`,
      },
    ],
  },
  {
    key: "ai-workflows", name: "AI Workflows", description: "AI prompts and workflow automations",
    items: [
      {
        key: "code-review", title: "Code review prompt", type: SystemType.PROMPT,
        description: "Review a diff for concrete correctness and security issues.",
        content: "Review the following diff in its surrounding context. Prioritize correctness, authorization, data loss, and concurrency issues. For each finding, identify the file and line, explain a concrete failing scenario, and propose a focused fix and verification step. Distinguish confirmed bugs from questions; do not invent missing context.\n\nContext: {{context}}\nDiff: {{diff}}",
      },
      {
        key: "documentation", title: "Generate API documentation", type: SystemType.PROMPT,
        description: "Draft documentation from an implementation and its tests.",
        content: "Using only the supplied implementation and tests, document this API for a new developer. Include purpose, inputs, outputs, validation, authorization requirements, errors, and one minimal usage example. Mark behavior you cannot establish as an open question. Never include credentials or private example data.\n\nImplementation: {{code}}\nTests: {{tests}}",
      },
      {
        key: "refactoring", title: "Plan a behavior-preserving refactor", type: SystemType.PROMPT,
        description: "Break a refactor into small changes with explicit verification.",
        content: "Inspect this code and propose a small refactor that improves readability while preserving public behavior. State the current behavior, identify duplicated responsibilities, and outline incremental changes. Include edge cases and tests that would detect regressions. Explain tradeoffs before changing interfaces or adding dependencies.\n\nCode: {{code}}\nConstraints: {{constraints}}",
      },
    ],
  },
  {
    key: "devops", name: "DevOps", description: "Infrastructure and deployment resources",
    items: [
      {
        key: "dockerfile", title: "Node.js Dockerfile", type: SystemType.SNIPPET,
        description: "Containerize a compiled Node.js service with a lockfile and a non-root runtime user.",
        language: "dockerfile",
        content: `FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node
CMD ["node", "dist/index.js"]`,
      },
      {
        key: "compose-deploy", title: "Deploy a Docker Compose service", type: SystemType.COMMAND,
        description: "Pull a published application image and replace the running app service using its Compose configuration.",
        content: "docker compose pull app\ndocker compose up -d --no-deps app\ndocker compose ps app",
      },
      {
        key: "docker-docs", title: "Docker documentation", type: SystemType.URL,
        description: "Official guides for containers, images, Dockerfiles, and Compose.", url: "https://docs.docker.com/",
      },
      {
        key: "actions-docs", title: "GitHub Actions documentation", type: SystemType.URL,
        description: "Official documentation for workflow automation and CI/CD.", url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    key: "terminal-commands", name: "Terminal Commands", description: "Useful shell commands for everyday development",
    items: [
      {
        key: "git-history", title: "Inspect Git changes and history", type: SystemType.COMMAND,
        description: "Check working-tree changes and review recent commits without modifying files.",
        content: "git status --short\ngit diff --stat\ngit log --oneline --graph -10",
      },
      {
        key: "docker-inspect", title: "Inspect Docker containers and logs", type: SystemType.COMMAND,
        description: "List running containers and view recent logs for an app container.",
        content: "docker ps\ndocker logs --tail 100 app\ndocker stats --no-stream",
      },
      {
        key: "process-management", title: "Find a process using a port in PowerShell", type: SystemType.COMMAND,
        description: "Inspect the process listening on port 3000 before deciding whether to stop it.",
        content: "Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess\nGet-Process -Id <OwningProcess>",
      },
      {
        key: "npm-utilities", title: "Inspect npm dependencies and scripts", type: SystemType.COMMAND,
        description: "Review direct dependencies, available scripts, and outdated package versions.",
        content: "npm ls --depth=0\nnpm run\nnpm outdated",
      },
    ],
  },
  {
    key: "design-resources", name: "Design Resources", description: "UI/UX resources and references",
    items: [
      {
        key: "tailwind-docs", title: "Tailwind CSS documentation", type: SystemType.URL,
        description: "Utility classes, responsive layouts, and theme references.", url: "https://tailwindcss.com/docs",
      },
      {
        key: "shadcn-ui", title: "shadcn/ui components", type: SystemType.URL,
        description: "Accessible components for building a reusable interface library.", url: "https://ui.shadcn.com/",
      },
      {
        key: "material-design", title: "Material Design", type: SystemType.URL,
        description: "Design system guidance for components, layout, color, and typography.", url: "https://m3.material.io/",
      },
      {
        key: "lucide-icons", title: "Lucide icon library", type: SystemType.URL,
        description: "Browse consistent open-source icons for developer interfaces.", url: "https://lucide.dev/icons/",
      },
    ],
  },
];
