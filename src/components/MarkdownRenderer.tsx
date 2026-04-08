import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { CodeTabs, CodeTab } from "./mdx/CodeTabs";
import { CodeBlockWrapper } from "./mdx/CodeBlockWrapper";
import { Terminal } from "./mdx/Terminal";
import { Steps, Step } from "./mdx/Steps";
import Alert from "./mdx/Alert";
import { MdxIcon } from "./mdx/MdxIcon";
import { Accordion, AccordionItem } from "./mdx/Accordion";
import { Carousel } from "./mdx/Carousel";
import { ZoomImage } from "./mdx/ZoomImage";
import { Video, Audio } from "./mdx/Media";
import { GithubRepo } from "./mdx/GithubRepo";
import { FileTree, Folder, File } from "./mdx/FileTree";
import { BentoGrid, BentoCard, Timeline, TimelineItem } from "./mdx/ExtendedComponents";
import PropertyTable from "./mdx/PropertyTable";
import { Hero } from "./mdx/Hero";
import { Mermaid } from "./mdx/Mermaid";
import { Badge } from "./mdx/Badge";

interface MarkdownRendererProps {
  content: string;
}

const components = {
  // Map standard HTML tags or custom components
  CodeTabs,
  CodeTab,
  Terminal,
  Steps,
  Step,
  CodeBlockWrapper,
  Alert,
  Accordion,
  AccordionItem,
  Carousel,
  ZoomImage,
  Video,
  Audio,
  GithubRepo,
  FileTree,
  Folder,
  File,
  PropertyTable,
  PropertyGrid: PropertyTable,
  Hero,
  Mermaid,
  BentoGrid,
  BentoCard,
  Timeline,
  TimelineItem,
  Badge,
  // Aliases
  icon: MdxIcon,
  Icon: MdxIcon,
  accordion: Accordion,
  accordionitem: AccordionItem,
  carousel: Carousel,
  zoomimage: ZoomImage,
  video: Video,
  audio: Audio,
  github: GithubRepo,
  repo: GithubRepo,
  Github: GithubRepo,
  tabs: CodeTabs,
  tab: CodeTab,
  terminal: Terminal,
  steps: Steps,
  step: Step,
  alert: Alert,
  filetree: FileTree,
  folder: Folder,
  file: File,
  props: PropertyTable,
  propGrid: PropertyTable,
  hero: Hero,
  mermaid: Mermaid,
  flow: Mermaid,
  chart: Mermaid,
  bento: BentoGrid,
  bentocard: BentoCard,
  timeline: Timeline,
  timelineitem: TimelineItem,
  badge: Badge,
  // Override figure to wrap code blocks
  figure: ({ children, "data-rehype-pretty-code-figure": isPrettyCode, ...props }: any) => {
    if (isPrettyCode !== undefined || 'data-rehype-pretty-code-figure' in props) {
      return <CodeBlockWrapper {...props} data-rehype-pretty-code-figure={isPrettyCode}>{children}</CodeBlockWrapper>;
    }
    return <figure {...props}>{children}</figure>;
  },
};

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const mdxOptions: any = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, {
        theme: "github-dark",
        keepBackground: false,
      }],
    ],
  };

  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <MDXRemote 
        source={content} 
        components={components}
        options={{ mdxOptions }}
      />
    </article>
  );
}
