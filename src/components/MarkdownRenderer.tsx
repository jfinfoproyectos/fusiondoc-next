import { compileMDX } from "next-mdx-remote/rsc";
import { getCodeTheme } from "@/app/actions/code-themes";
import remarkGfm from "remark-gfm";
import { remarkP5Sketch } from "@/lib/remark-p5";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { MdxErrorFallback } from "./MdxErrorFallback";
import { CodeBlockWrapper } from "./mdx/CodeBlockWrapper";
import { mdxComponents } from "./mdx-components";

const components = {
  ...mdxComponents,
  // Map standard HTML tags
  p: (props: any) => <div {...props} className="my-4 last:mb-0" />,
  figure: ({ children, "data-rehype-pretty-code-figure": isPrettyCode, ...props }: any) => {
    if (isPrettyCode !== undefined || 'data-rehype-pretty-code-figure' in props) {
      return <CodeBlockWrapper {...props} data-rehype-pretty-code-figure={isPrettyCode}>{children}</CodeBlockWrapper>;
    }
    return <figure {...props}>{children}</figure>;
  },
};

interface MarkdownRendererProps {
  content: string;
}

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const codeTheme = await getCodeTheme();

  const mdxOptions: any = {
    remarkPlugins: [remarkGfm, remarkP5Sketch],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, {
        theme: codeTheme,
        keepBackground: true,
      }],
    ],
  };

  try {
    const { content: compiledContent } = await compileMDX({
      source: content,
      components,
      options: { mdxOptions },
    });

    return (
      <article className="prose max-w-none dark:prose-invert">
        {compiledContent}
      </article>
    );
  } catch (error: any) {
    console.error("Critical MDX Parsing Error:", error);
    return <MdxErrorFallback error={error} />;
  }
}
