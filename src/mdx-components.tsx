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
import { BentoGrid, BentoCard, Timeline, TimelineItem } from "./components/mdx/ExtendedComponents";
import PropertyTable from "./components/mdx/PropertyTable";
import { Hero } from "./components/mdx/Hero";
import { Mermaid } from "./components/mdx/Mermaid";
import { Badge } from "./components/mdx/Badge";

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
    PropertyGrid: PropertyTable,
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
  };
}
