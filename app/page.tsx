import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./components/mdx";
import { Wrapper } from "./components/mdx/Wrapper";
import { Languages } from "./components/oss/Languages";
import { Orgs } from "./components/oss/Orgs";
import { Contributions } from "./components/oss/Contributions";

export default async function Home() {
  const content = await fs.readFile(
    path.join(process.cwd(), "content", "index.md"),
    "utf-8"
  );

  return (
    <Wrapper>
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
    </Wrapper>
  );
}
