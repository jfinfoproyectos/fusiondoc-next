import { visit } from "unist-util-visit";

export default function remarkCustomDirectives() {
  return (tree: any) => {
    visit(tree, (node: any) => {
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
        } else if (node.name === "terminal") {
          const data = node.data || (node.data = {});
          data.hName = "terminal";
          data.hProperties = node.attributes || {};
        } else if (node.name === "steps") {
          const data = node.data || (node.data = {});
          data.hName = "steps";
          data.hProperties = node.attributes || {};
        } else if (node.name === "step") {
          const data = node.data || (node.data = {});
          data.hName = "step";
          data.hProperties = node.attributes || {};
        }
      }
    });
  };
}
