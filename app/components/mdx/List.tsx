import type { HTMLAttributes, ReactNode } from "react";

interface ListProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function UnorderedList({ children }: ListProps) {
  return <ul className="mb-6 space-y-0.5 nested-list">{children}</ul>;
}

export function ListItem({ children }: ListProps) {
  return (
    <li>
      <span className="text-[var(--bullet)]">*</span> {children}
    </li>
  );
}
