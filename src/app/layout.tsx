import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./rehype-styles.css";
import Header from "@/components/Header";
import TopicsBar from "@/components/TopicsBar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fusiondoc Next",
  description: "Documentación estática generada desde GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(robotoHeading.variable)} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <TopicsBar />
            <div className="flex flex-1 max-w-[1600px] mx-auto w-full relative">
              <Sidebar />
              <main className="flex-1 w-full min-w-0 p-6 md:p-8">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
