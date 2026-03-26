import { visit } from "unist-util-visit";

export default function remarkCustomDirectives() {
  return (tree: any) => {
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
