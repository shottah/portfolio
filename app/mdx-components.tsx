import type { MDXComponents } from "mdx/types";
import type { ReactNode, AnchorHTMLAttributes, HTMLAttributes } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-[var(--heading)] text-lg mb-1">
      <span className="text-[var(--heading)]">#</span> {children}
    </h1>
  ),

  h2: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-[var(--heading)] mb-2 mt-6">
      <span className="text-[var(--heading)]">##</span> {children}
    </h2>
  ),

  h3: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-[var(--heading)] mb-2 mt-4">
      <span className="text-[var(--heading)]">###</span> {children}
    </h3>
  ),

  p: ({ children }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-1">{children}</p>
  ),

  ul: ({ children }: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-6 space-y-0.5 nested-list">{children}</ul>
  ),

  li: ({ children }: HTMLAttributes<HTMLLIElement>) => (
    <li>
      <span className="text-[var(--bullet)]">*</span> {children}
    </li>
  ),

  a: ({ href, children }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className="text-[var(--link)]">
      [{children}]
    </a>
  ),

  strong: ({ children }: HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold">{children}</strong>
  ),

  em: ({ children }: HTMLAttributes<HTMLElement>) => (
    <em className="italic">{children}</em>
  ),

  hr: () => <hr className="my-6 border-[var(--foreground)] opacity-20" />,

  wrapper: ({ children }: { children: ReactNode }) => (
    <main className="max-w-2xl mx-auto px-6 py-12">{children}</main>
  ),
};
