# shottah.xyz

Personal portfolio site for [Matthew Abraham](https://matthewabrahim.com), rendered from a single Markdown file via Next.js App Router and `next-mdx-remote`.

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- `next-mdx-remote` + `remark-gfm` for content rendering

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Content

Page content lives in [`content/index.md`](./content/index.md). MDX components that style the markdown output are in [`app/components/mdx/`](./app/components/mdx).
