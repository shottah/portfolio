import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

export function Anchor({ href = "", children }: LinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a
        href={href}
        className="text-[var(--link)]"
        target="_blank"
        rel="noopener noreferrer"
      >
        [{children}]
      </a>
    );
  }

  return (
    <Link href={href} className="text-[var(--link)]">
      [{children}]
    </Link>
  );
}
