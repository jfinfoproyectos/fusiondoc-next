import Link from 'next/link';
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex items-center px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold text-xl text-primary flex items-center gap-2">
           <svg xmlns="http://www.w3.org/20urn:schemas-microsoft-com:office:office" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
           Fusiondoc Next
        </Link>
      </div>
      <div className="flex items-center ml-auto gap-4 text-sm font-medium">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
          GitHub
        </a>
        <ModeToggle />
      </div>
    </header>
  );
}
