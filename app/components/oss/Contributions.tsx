import {
  classify,
  fetchContributions,
  repoFullName,
  type GitHubSearchItem,
  type ItemKind,
} from "@/lib/github";
import { H2 } from "../mdx/Headings";
import { UnorderedList, ListItem } from "../mdx/List";
import { Anchor } from "../mdx/Link";

function pluralize(n: number, singular: string): string {
  return `${n} ${singular}${n === 1 ? "" : "s"}`;
}

export async function Contributions() {
  const result = await fetchContributions();

  if (!result.ok) {
    return (
      <>
        <H2>Open Source Activity</H2>
        <p className="mb-6 opacity-60">
          GitHub data unavailable right now ({result.error}).
        </p>
      </>
    );
  }

  const items = result.data;
  const buckets: Record<ItemKind, GitHubSearchItem[]> = {
    "pr-open": [],
    "pr-merged": [],
    "pr-closed": [],
    "issue-open": [],
    "issue-closed": [],
  };
  for (const item of items) buckets[classify(item)].push(item);

  const open = [...buckets["pr-open"], ...buckets["issue-open"]].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const summary: string[] = [];
  if (buckets["pr-merged"].length)
    summary.push(pluralize(buckets["pr-merged"].length, "merged PR"));
  if (buckets["pr-closed"].length)
    summary.push(pluralize(buckets["pr-closed"].length, "closed PR"));
  if (buckets["issue-closed"].length)
    summary.push(pluralize(buckets["issue-closed"].length, "closed issue"));

  return (
    <>
      <H2>Open Source Activity</H2>
      {open.length > 0 ? (
        <UnorderedList>
          {open.map((item) => (
            <ListItem key={item.id}>
              <Anchor href={item.html_url}>
                {repoFullName(item)}#{item.number}
              </Anchor>{" "}
              - {item.title} ({item.pull_request ? "PR" : "issue"})
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <p className="mb-6">No open PRs or issues right now.</p>
      )}
      {summary.length > 0 && (
        <p className="mb-6 opacity-60">+ {summary.join(", ")}</p>
      )}
    </>
  );
}
