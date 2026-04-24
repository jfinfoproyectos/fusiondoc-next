import { CodeTabs, CodeTab } from "@/components/mdx/CodeTabs";
import { CodeBlockWrapper } from "@/components/mdx/CodeBlockWrapper";
import { Terminal } from "@/components/mdx/Terminal";
import { Steps, Step } from "@/components/mdx/Steps";
import Alert from "@/components/mdx/Alert";
import { MdxIcon } from "@/components/mdx/MdxIcon";
import { Accordion, AccordionItem } from "@/components/mdx/Accordion";
import { Carousel } from "@/components/mdx/Carousel";
import { ZoomImage } from "@/components/mdx/ZoomImage";
import { Video, Audio } from "@/components/mdx/Media";
import { GithubRepo } from "@/components/mdx/GithubRepo";
import { FileTree, Folder, File } from "@/components/mdx/FileTree";
import PropertyTable from "@/components/mdx/PropertyTable";
import { Hero } from "@/components/mdx/Hero";
import { Badge } from "@/components/mdx/Badge";
import { CodeExplainer, CodeExplainerFile, CodeExplainerStep } from "@/components/mdx/CodeExplainer";
import { CodeEmbed } from "@/components/mdx/CodeEmbed";
import { BentoGrid, BentoCard } from "@/components/mdx/BentoGrid";
import { Timeline, TimelineItem } from "@/components/mdx/Timeline";
import { FeatureGlowGrid, FeatureGlowCard } from "@/components/mdx/FeatureGlow";
import { Roadmap, RoadmapItem } from "@/components/mdx/Roadmap";
import { Tooltip } from "@/components/mdx/Tooltip";
import { Kbd } from "@/components/mdx/Kbd";
import { TextReveal } from "@/components/mdx/TextReveal";
import { AnimatedSVG } from "@/components/mdx/AnimatedSVG";
import { TimelineFlow } from "@/components/mdx/TimelineFlow";
import { X6Diagram } from "@/components/mdx/X6Diagram";
import { AlgoVisualizer } from "@/components/mdx/AlgoVisualizer";
import { P5Sketch } from "@/components/mdx/P5Sketch";
import { JSXGraphBoard } from "@/components/mdx/JSXGraphBoard";
import {
  MafsBoard,
  MafsCoordinates,
  MafsPlot,
  MafsPoint,
} from "@/components/mdx/MafsComponents";
import { LatexBlock, LatexInline } from "@/components/mdx/Latex";

export const mdxComponents = {
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
};
