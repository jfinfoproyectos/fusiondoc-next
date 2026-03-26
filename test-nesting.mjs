import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";

function remarkCustomDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const data = node.data || (node.data = {});
        data.hName = node.name;
        data.hProperties = node.attributes || {};
      }
    });
  };
}

async function test() {
  const content = `
::::::steps

:::::step{title="Paso 1"}
Contenido del paso 1.

::terminal{commands="ls"}

:::::

:::::step{title="Paso 2"}
Contenido con tabs.

::::tabs
:::tab{title="npm"}
npm install
:::
:::tab{title="yarn"}
yarn install
:::
::::

:::::

::::::
  `;

  const file = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomDirectives)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .process(content);

  console.log(JSON.stringify(file.result || file.value, null, 2));
}

test();
