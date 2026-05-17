import { cache } from "react";

const GITHUB_API = "https://api.github.com";
const USERNAME = "shottah";
const REVALIDATE_SECONDS = 60 * 60 * 24;
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

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
  url.searchParams.set("q", `author:${USERNAME} -user:${USERNAME}`);
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", "updated");
  url.searchParams.set("order", "desc");

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
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
        return page === 1 ? res : { ok: true, data: all };
      }
      all.push(...res.data.items);
      if (res.data.items.length < PAGE_SIZE) break;
    }
    return { ok: true, data: all };
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
