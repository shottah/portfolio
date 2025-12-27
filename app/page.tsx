import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./components/mdx";

export default async function Home() {
  const content = await fs.readFile(
    path.join(process.cwd(), "content", "index.md"),
    "utf-8"
  );

  return (
    <MDXRemote
      source={content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
