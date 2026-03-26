import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import remarkDirective from "remark-directive";
import remarkCustomDirectives from "../lib/remark-custom";
import * as prod from "react/jsx-runtime";
import { CodeTabs, CodeTab } from "./mdx/CodeTabs";
import { CodeBlockWrapper } from "./mdx/CodeBlockWrapper";

interface MarkdownRendererProps {
  content: string;
}

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const prettyCodeOptions = {
    theme: "github-dark",
    keepBackground: false,
  };

  // Traversal helper
  const visit = (node: any, tagName: string, callback: (node: any) => void) => {
    if (node.tagName === tagName) {
      callback(node);
    }
    if (node.children) {
      node.children.forEach((child: any) => visit(child, tagName, callback));
    }
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomDirectives)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(() => (tree: any) => {
      visit(tree, "code", (node: any) => {
        if (node.data && node.data.meta) {
          node.properties = node.properties || {};
          node.properties.metaString = node.data.meta;
        }
      });
    })
    .use(rehypeRaw)
    .use(() => (tree: any) => {
      visit(tree, "code", (node: any) => {
        if (node.properties && node.properties.metaString) {
          node.data = node.data || {};
          node.data.meta = node.properties.metaString;
          // rehype-pretty-code expects it directly as a string to parse
        }
      });
    })
    .use(rehypeSlug)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeReact, {
      ...prod,
      components: {
        tabs: CodeTabs,
        tab: CodeTab,
        figure: ({ children, "data-rehype-pretty-code-figure": isPrettyCode, ...props }: any) => {
          // React might pass "" or true for a boolean attribute. We just need to check if it's explicitly undefined.
          if (isPrettyCode === undefined && !('data-rehype-pretty-code-figure' in props)) {
            return <figure {...props}>{children}</figure>;
          }
          return <CodeBlockWrapper {...props} data-rehype-pretty-code-figure={isPrettyCode}>{children}</CodeBlockWrapper>;
        },
      },
    } as any)
    .process(content);

  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      {file.result}
    </article>
  );
}
