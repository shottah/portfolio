export interface Article {
  slug: string;
  title: string;
  navLabel: string;
  href: string;
}

export const articles: Article[] = [
  {
    slug: "credit-vs-cash",
    title: "Credit vs Cash in a Two-Rate Economy",
    navLabel: "Credit vs Cash",
    href: "/writing/credit-vs-cash",
  },
];
