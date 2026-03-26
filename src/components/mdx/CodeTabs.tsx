import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Icon } from "@iconify/react";

interface CodeTabsProps {
  children: React.ReactNode;
}

export function CodeTabs({ children }: CodeTabsProps) {
  // We need to parse the children to extract the tabs
  // children could be an array of <tab> elements from markdown
  const childrenArray = React.Children.toArray(children);
  
  // Find all the 'tab' elements from rehype-raw parsing
  // Their props will contain the title and value
  const tabsContext = childrenArray.map((child: any) => {
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<any>;
      return {
        title: element.props.title || "Tab",
        icon: element.props.icon,
        value: element.props.value || element.props.title || Math.random().toString(),
        content: element.props.children
      };
    }
    return null;
  }).filter(Boolean);

  if (tabsContext.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <Tabs defaultValue={tabsContext[0]?.value} className="w-full my-6 rounded-lg overflow-hidden ring-1 ring-white/10 bg-[#0d1117] flex flex-col">
      <TabsList className="w-full justify-start bg-transparent border-b border-white/10 p-1 h-auto rounded-none text-white/60">
        {tabsContext.map((tab) => (
          <TabsTrigger 
            key={tab?.value} 
            value={tab?.value as string}
            className="!rounded-md !border-0 data-[state=active]:!bg-white/10 data-[state=active]:!text-white data-[state=active]:!shadow-none px-4 py-1.5 mx-0.5 !text-white/60 hover:!text-white transition-colors flex items-center gap-2"
          >
            {tab?.icon && <Icon icon={tab?.icon} className="h-4 w-4" />}
            {tab?.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsContext.map((tab) => (
        <TabsContent 
          key={tab?.value} 
          value={tab?.value as string} 
          className="mt-0 flex-1 [&_[data-rehype-pretty-code-figure]]:!my-0 [&_[data-rehype-pretty-code-figure]]:!ring-0 [&_[data-rehype-pretty-code-figure]]:!rounded-none"
        >
          {tab?.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

// To support raw mapping for 'tab' node (inner children)
// In our implementation, CodeTabs handles the rendering of TabsContent, 
// so we don't necessarily need a mapping for 'tab' to return anything standalone,
// but it's good practice. We can just return null or the children if rendered outside.
export function CodeTab({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}
