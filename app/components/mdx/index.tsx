import type { MDXComponents } from "mdx/types";
import { H1, H2, H3 } from "./Headings";
import { Paragraph, Strong, Emphasis } from "./Text";
import { UnorderedList, ListItem } from "./List";
import { Anchor } from "./Link";
import { HorizontalRule } from "./Divider";
import { Wrapper } from "./Wrapper";

export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  ul: UnorderedList,
  li: ListItem,
  a: Anchor,
  strong: Strong,
  em: Emphasis,
  hr: HorizontalRule,
  wrapper: Wrapper,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
