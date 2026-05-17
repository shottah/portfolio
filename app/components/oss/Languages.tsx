import { fetchLanguageStats } from "@/lib/github";
import { H2 } from "../mdx/Headings";
import { UnorderedList, ListItem } from "../mdx/List";

const BAR_WIDTH = 10;

function bar(percent: number): string {
  if (percent <= 0) return " ".repeat(BAR_WIDTH);
  const raw = Math.round((percent / 100) * BAR_WIDTH);
  const filled = Math.min(BAR_WIDTH, Math.max(1, raw));
  return "█".repeat(filled) + " ".repeat(BAR_WIDTH - filled);
}

export async function Languages() {
  const result = await fetchLanguageStats();

  if (!result.ok) {
    return (
      <>
        <H2>Tools</H2>
        <p className="mb-6 opacity-60">
          GitHub data unavailable right now ({result.error}).
        </p>
      </>
    );
  }

  if (result.data.length === 0) {
    return (
      <>
        <H2>Tools</H2>
        <p className="mb-6">No language data yet.</p>
      </>
    );
  }

  const maxNameLen = Math.max(...result.data.map((s) => s.name.length));
  const maxPercentLen = Math.max(
    ...result.data.map((s) => `${s.percent}%`.length)
  );

  return (
    <>
      <H2>Tools</H2>
      <UnorderedList>
        {result.data.map((stat) => (
          <ListItem key={stat.name}>
            <span className="whitespace-pre">
              {stat.name.padEnd(maxNameLen)} [{bar(stat.percent)}]{" "}
              {`${stat.percent}%`.padStart(maxPercentLen)}
            </span>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
}
