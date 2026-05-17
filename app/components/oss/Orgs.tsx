import { fetchContributions, repoFullName } from "@/lib/github";
import { H2 } from "../mdx/Headings";
import { UnorderedList, ListItem } from "../mdx/List";
import { Anchor } from "../mdx/Link";

export async function Orgs() {
  const result = await fetchContributions();

  if (!result.ok) {
    return (
      <>
        <H2>Open Source Orgs</H2>
        <p className="mb-6 opacity-60">
          GitHub data unavailable right now ({result.error}).
        </p>
      </>
    );
  }

  const counts = new Map<string, number>();
  for (const item of result.data) {
    if (!item.pull_request) continue;
    const repo = repoFullName(item);
    counts.set(repo, (counts.get(repo) ?? 0) + 1);
  }

  const entries = Array.from(counts.entries())
    .map(([repo, count]) => ({ repo, count }))
    .sort((a, b) => b.count - a.count || a.repo.localeCompare(b.repo));

  if (entries.length === 0) {
    return (
      <>
        <H2>Open Source Orgs</H2>
        <p className="mb-6">No external repos contributed to yet.</p>
      </>
    );
  }

  return (
    <>
      <H2>Open Source Orgs</H2>
      <UnorderedList>
        {entries.map(({ repo, count }) => (
          <ListItem key={repo}>
            <Anchor href={`https://github.com/${repo}`}>{repo}</Anchor> ({count}{" "}
            PR{count === 1 ? "" : "s"})
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
}
