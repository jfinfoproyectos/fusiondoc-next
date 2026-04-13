import { MDXRemote } from "next-mdx-remote/rsc";
import { getCodeTheme } from "@/app/actions/code-themes";
import remarkGfm from "remark-gfm";
import { remarkP5Sketch } from "@/lib/remark-p5";
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
import PropertyTable from "./mdx/PropertyTable";
import { Hero } from "./mdx/Hero";
import { Badge } from "./mdx/Badge";
import { CodeExplainer, CodeExplainerFile, CodeExplainerStep } from "./mdx/CodeExplainer";
import { CodeEmbed } from "./mdx/CodeEmbed";
import { BentoGrid, BentoCard } from "./mdx/BentoGrid";
import { Timeline, TimelineItem } from "./mdx/Timeline";
import { FeatureGlowGrid, FeatureGlowCard } from "./mdx/FeatureGlow";
import { Roadmap, RoadmapItem } from "./mdx/Roadmap";
import { Tooltip } from "./mdx/Tooltip";
import { Kbd } from "./mdx/Kbd";
import { TextReveal } from "./mdx/TextReveal";
import { AnimatedSVG } from "./mdx/AnimatedSVG";
import { TimelineFlow } from "./mdx/TimelineFlow";
import { X6Diagram } from "./mdx/X6Diagram";
import { AlgoVisualizer } from "./mdx/AlgoVisualizer";
import { P5Sketch } from "./mdx/P5Sketch";
import { JSXGraphBoard } from "./mdx/JSXGraphBoard";
import {
  MafsBoard,
  MafsCoordinates,
  MafsPlot,
  MafsPoint,
} from "./mdx/MafsComponents";
import { LatexBlock, LatexInline } from "./mdx/Latex";


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
  Badge,
  CodeEmbed,
  BentoGrid,
  BentoCard,
  Timeline,
  TimelineItem,
  FeatureGlowGrid,
  FeatureGlowCard,
  Roadmap,
  RoadmapItem,
  Tooltip,
  Kbd,
  X6Diagram,
  AlgoVisualizer,
  P5Sketch,
  JSXGraphBoard,

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
  badge: Badge,
  CodeExplainer,
  CodeExplainerFile,
  CodeExplainerStep,
  codeexplainer: CodeExplainer,
  codeexplainerfile: CodeExplainerFile,
  codeexplainerstep: CodeExplainerStep,
  embed: CodeEmbed,
  codepen: CodeEmbed,
  sandbox: CodeEmbed,
  stackblitz: CodeEmbed,
  bentogrid: BentoGrid,
  bentocard: BentoCard,
  timeline: Timeline,
  timelineitem: TimelineItem,
  FeatureGlow: FeatureGlowGrid,
  featureglow: FeatureGlowGrid,

  featureglowcard: FeatureGlowCard,

  roadmap: Roadmap,

  roadmapitem: RoadmapItem,

  tooltip: Tooltip,

  kbd: Kbd,
  TextReveal,
  AnimatedSVG,
  TimelineFlow,
  textreveal: TextReveal,
  svgdraw: AnimatedSVG,
  flow: TimelineFlow,
  X6: X6Diagram,
  algo: AlgoVisualizer,
  Algo: AlgoVisualizer,
  sketch: P5Sketch,
  Sketch: P5Sketch,
  JSXGraph: JSXGraphBoard,
  jsxgraph: JSXGraphBoard,
  MafsBoard,
  MafsCoordinates,
  MafsPlot,
  MafsPoint,
  Latex: LatexBlock,
  LatexInline,
  Math: LatexBlock,
  MathInline: LatexInline,

  // Override figure to wrap code blocks
  figure: ({ children, "data-rehype-pretty-code-figure": isPrettyCode, ...props }: any) => {
    if (isPrettyCode !== undefined || 'data-rehype-pretty-code-figure' in props) {
      return <CodeBlockWrapper {...props} data-rehype-pretty-code-figure={isPrettyCode}>{children}</CodeBlockWrapper>;
    }
    return <figure {...props}>{children}</figure>;
  },
};

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const codeTheme = await getCodeTheme();

  const mdxOptions: any = {
    remarkPlugins: [remarkGfm, remarkP5Sketch],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, {
        theme: codeTheme,
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
