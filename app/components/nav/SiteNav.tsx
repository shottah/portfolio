import Link from "next/link";
import { articles } from "@/lib/articles";
import { apps } from "@/lib/apps";

interface SiteNavProps {
  /** Marks which top-level item is the current page. */
  current?: "home" | "articles" | "apps";
}

export function SiteNav({ current }: SiteNavProps) {
  return (
    <nav aria-label="Site" className="text-sm">
      <ul className="space-y-1">
        <li>
          <Link
            href="/"
            aria-current={current === "home" ? "page" : undefined}
            className="text-[var(--link)]"
          >
            [home]
          </Link>
        </li>
        <li>
          <details className="nav-dropdown" open={current === "articles"}>
            <summary className="cursor-pointer text-[var(--link)]">
              <span className="caret text-[var(--bullet)]">&#9656;</span>{" "}
              [articles]
            </summary>
            <ul className="mt-1 ml-4 space-y-1">
              {articles.map((article) => (
                <li key={article.slug}>
                  <span className="text-[var(--bullet)]">*</span>{" "}
                  <Link href={article.href} className="text-[var(--link)]">
                    {article.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>
        <li>
          <details className="nav-dropdown" open={current === "apps"}>
            <summary className="cursor-pointer text-[var(--link)]">
              <span className="caret text-[var(--bullet)]">&#9656;</span>{" "}
              [apps]
            </summary>
            <ul className="mt-1 ml-4 space-y-1">
              {apps.map((app) => (
                <li key={app.slug}>
                  <span className="text-[var(--bullet)]">*</span>{" "}
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--link)]"
                  >
                    {app.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </li>
      </ul>
    </nav>
  );
}
