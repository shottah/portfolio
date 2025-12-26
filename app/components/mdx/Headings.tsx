import type { HTMLAttributes, ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function H1({ children }: HeadingProps) {
  return (
    <h1 className="text-[var(--heading)] text-lg mb-1">
      <span className="text-[var(--heading)]">#</span> {children} <ThemeToggle />
    </h1>
  );
}

export function H2({ children }: HeadingProps) {
  return (
    <h2 className="text-[var(--heading)] mb-2 mt-6">
      <span className="text-[var(--heading)]">##</span> {children}
    </h2>
  );
}

export function H3({ children }: HeadingProps) {
  return (
    <h3 className="text-[var(--heading)] mb-2 mt-4">
      <span className="text-[var(--heading)]">###</span> {children}
    </h3>
  );
}
