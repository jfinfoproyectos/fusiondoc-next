import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

function remarkCustomDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name === "tabs") {
          const data = node.data || (node.data = {});
          data.hName = "tabs";
          data.hProperties = node.attributes || {};
        } else if (node.name === "tab") {
          const data = node.data || (node.data = {});
          data.hName = "tab";
          data.hProperties = node.attributes || {};
        }
      }
    });
  };
}

async function test() {
  const content = `
::::tabs

:::tab{title="npm" value="npm"}
\`\`\`bash showLineNumbers
npm install react react-dom
npm run dev
\`\`\`
:::

::::
  `;

  const file = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomDirectives)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, { theme: "github-dark" })
    .process(content);

  console.log(file.value);
}

test();
