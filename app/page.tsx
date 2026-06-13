import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./components/mdx";
import { SiteNav } from "./components/nav/SiteNav";
import { Languages } from "./components/oss/Languages";
import { Orgs } from "./components/oss/Orgs";
import { Contributions } from "./components/oss/Contributions";

export default async function Home() {
  const content = await fs.readFile(
    path.join(process.cwd(), "content", "index.md"),
    "utf-8"
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-12">
          <SiteNav current="home" />
        </div>
      </aside>

      <main className="max-w-2xl min-w-0">
        <div className="mb-8 lg:hidden">
          <SiteNav current="home" />
        </div>

        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
        <Languages />
        <Orgs />
        <Contributions />
      </main>
    </div>
  );
}
