import { cache } from "react";

const GITHUB_API = "https://api.github.com";
const USERNAME = "shottah";
const REVALIDATE_SECONDS = 60 * 60 * 24;
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

const EXCLUDED_OWNER_SUBSTRINGS = [
  "shottah",
  "zed",
  "vifi",
  "oneramp",
  "kolektivo",
  "uwi",
  "varoun",
  "timlrx",
  "whitney",
];

function ownerOf(item: GitHubSearchItem): string {
  return repoFullName(item).split("/")[0].toLowerCase();
}

function isExcludedOwner(item: GitHubSearchItem): boolean {
  const owner = ownerOf(item);
  return EXCLUDED_OWNER_SUBSTRINGS.some((s) => owner.includes(s));
}

export type GitHubResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface GitHubPullRequestRef {
  merged_at: string | null;
}

export interface GitHubSearchItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  repository_url: string;
  pull_request?: GitHubPullRequestRef;
  created_at: string;
  updated_at: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchItem[];
}

async function fetchSearchPage(
  page: number
): Promise<GitHubResult<GitHubSearchResponse>> {
  const url = new URL(`${GITHUB_API}/search/issues`);
  url.searchParams.set("q", `is:public author:${USERNAME}`);
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", "updated");
  url.searchParams.set("order", "desc");

  try {
    const res = await fetch(url, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status} ${res.statusText}` };
    }
    return { ok: true, data: (await res.json()) as GitHubSearchResponse };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

export const fetchContributions = cache(
  async (): Promise<GitHubResult<GitHubSearchItem[]>> => {
    const all: GitHubSearchItem[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetchSearchPage(page);
      if (!res.ok) {
        return page === 1
          ? res
          : { ok: true, data: all.filter((item) => !isExcludedOwner(item)) };
      }
      all.push(...res.data.items);
      if (res.data.items.length < PAGE_SIZE) break;
    }
    return { ok: true, data: all.filter((item) => !isExcludedOwner(item)) };
  }
);

export type ItemKind =
  | "pr-open"
  | "pr-merged"
  | "pr-closed"
  | "issue-open"
  | "issue-closed";

export function classify(item: GitHubSearchItem): ItemKind {
  if (item.pull_request) {
    if (item.state === "open") return "pr-open";
    return item.pull_request.merged_at ? "pr-merged" : "pr-closed";
  }
  return item.state === "open" ? "issue-open" : "issue-closed";
}

export function repoFullName(item: GitHubSearchItem): string {
  return item.repository_url.replace(
    /^https:\/\/api\.github\.com\/repos\//,
    ""
  );
}

const TOP_LANGUAGES = 5;

const EXCLUDED_LANGUAGES = new Set([
  "HTML",
  "CSS",
  "SCSS",
  "Sass",
  "Less",
  "JSON",
  "YAML",
  "Markdown",
  "MDX",
  "TeX",
  "Dockerfile",
  "Procfile",
  "INI",
  "TOML",
  "XML",
  "Vue",
  "Svelte",
]);

interface GitHubOwnedRepo {
  archived: boolean;
  disabled: boolean;
  languages_url: string;
}

async function fetchOwnedRepos(): Promise<GitHubResult<GitHubOwnedRepo[]>> {
  const url = new URL(`${GITHUB_API}/users/${USERNAME}/repos`);
  url.searchParams.set("type", "owner");
  url.searchParams.set("sort", "pushed");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", "100");

  try {
    const res = await fetch(url, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status} ${res.statusText}` };
    }
    const repos = (await res.json()) as GitHubOwnedRepo[];
    return {
      ok: true,
      data: repos.filter((r) => !r.archived && !r.disabled),
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

async function fetchRepoLanguages(
  languagesUrl: string
): Promise<GitHubResult<Record<string, number>>> {
  try {
    const res = await fetch(languagesUrl, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub ${res.status} ${res.statusText}` };
    }
    return {
      ok: true,
      data: (await res.json()) as Record<string, number>,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percent: number;
}

export const fetchLanguageStats = cache(
  async (): Promise<GitHubResult<LanguageStat[]>> => {
    const repos = await fetchOwnedRepos();
    if (!repos.ok) return repos;

    const totals = new Map<string, number>();
    for (const repo of repos.data) {
      const langs = await fetchRepoLanguages(repo.languages_url);
      if (!langs.ok) continue;
      for (const [name, bytes] of Object.entries(langs.data)) {
        if (EXCLUDED_LANGUAGES.has(name)) continue;
        totals.set(name, (totals.get(name) ?? 0) + bytes);
      }
    }

    const totalBytes = Array.from(totals.values()).reduce((a, b) => a + b, 0);
    if (totalBytes === 0) return { ok: true, data: [] };

    const sorted = Array.from(totals.entries())
      .map(([name, bytes]) => ({ name, bytes }))
      .sort((a, b) => b.bytes - a.bytes);

    const top = sorted.slice(0, TOP_LANGUAGES);
    const restBytes = sorted
      .slice(TOP_LANGUAGES)
      .reduce((a, b) => a + b.bytes, 0);

    const stats: LanguageStat[] = top.map(({ name, bytes }) => ({
      name,
      bytes,
      percent: Math.round((bytes / totalBytes) * 100),
    }));

    if (restBytes > 0) {
      stats.push({
        name: "Other",
        bytes: restBytes,
        percent: Math.round((restBytes / totalBytes) * 100),
      });
    }

    return { ok: true, data: stats };
  }
);
