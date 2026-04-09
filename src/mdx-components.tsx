import type { MDXComponents } from "mdx/types";
import { CodeTabs, CodeTab } from "./components/mdx/CodeTabs";
import { Terminal } from "./components/mdx/Terminal";
import { Steps, Step } from "./components/mdx/Steps";
import { CodeBlockWrapper } from "./components/mdx/CodeBlockWrapper";
import Alert from "./components/mdx/Alert";
import { MdxIcon } from "./components/mdx/MdxIcon";
import { Accordion, AccordionItem } from "./components/mdx/Accordion";
import { Carousel } from "./components/mdx/Carousel";
import { ZoomImage } from "./components/mdx/ZoomImage";
import { Video, Audio } from "./components/mdx/Media";
import { GithubRepo } from "./components/mdx/GithubRepo";
import { FileTree, Folder, File } from "./components/mdx/FileTree";
import PropertyTable from "./components/mdx/PropertyTable";
import { Hero } from "./components/mdx/Hero";
import { Badge } from "./components/mdx/Badge";
import { CodeExplainer, CodeExplainerFile, CodeExplainerStep } from "./components/mdx/CodeExplainer";
import { CodeEmbed } from "./components/mdx/CodeEmbed";
import { BentoGrid, BentoCard } from "./components/mdx/BentoGrid";
import { Timeline, TimelineItem } from "./components/mdx/Timeline";
import { FeatureGlowGrid, FeatureGlowCard } from "./components/mdx/FeatureGlow";
import { Roadmap, RoadmapItem } from "./components/mdx/Roadmap";
import { Tooltip } from "./components/mdx/Tooltip";
import { Kbd } from "./components/mdx/Kbd";


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
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
    Hero,
    Badge,
    CodeExplainer,
    CodeExplainerFile,
    CodeExplainerStep,
    CodeEmbed,
    BentoGrid,
    BentoCard,
    Timeline,
    TimelineItem,
    FeatureGlowGrid,
    FeatureGlowCard,
    FeatureGlow: FeatureGlowGrid,
    Roadmap,
    RoadmapItem,
    Tooltip,
    Kbd,

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
    PropertyGrid: PropertyTable,
    propGrid: PropertyTable,
    hero: Hero,
    badge: Badge,
    explainer: CodeExplainer,
    explainerfile: CodeExplainerFile,
    explainerstep: CodeExplainerStep,
    embed: CodeEmbed,
    codepen: CodeEmbed,
    sandbox: CodeEmbed,
    stackblitz: CodeEmbed,
    bentogrid: BentoGrid,
    bentocard: BentoCard,
    timeline: Timeline,
    timelineitem: TimelineItem,
    featureglow: FeatureGlowGrid,
    featureglowcard: FeatureGlowCard,
    roadmap: Roadmap,
    roadmapitem: RoadmapItem,
    tooltip: Tooltip,
    kbd: Kbd,
  };
}
