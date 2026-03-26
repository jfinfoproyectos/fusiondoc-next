const { unified } = require("unified");
const remarkParse = require("remark-parse");
const remarkDirective = require("remark-directive");
const remarkGfm = require("remark-gfm");
const remarkRehype = require("remark-rehype");
const rehypeRaw = require("rehype-raw");
const rehypePrettyCode = require("rehype-pretty-code");

// Import the custom directive plugin logic directly here to test
const visit = require("unist-util-visit").visit;

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
