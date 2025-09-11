
import type {Metadata} from 'next';
import { Inter } from "next/font/google";
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Home, BarChart2, History, Info, Mail } from "lucide-react";
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BackgroundAnimation } from '@/components/background-animation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SmartCharts',
  description: 'Upload Data → Generate Charts Instantly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full flex-col bg-background relative">
            <BackgroundAnimation />
            <AppSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 z-10">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                </header>
                {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <BarChart2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">SmartCharts</span>
        </Link>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="/"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Dashboard</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Link
                        href="/history"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <History className="h-5 w-5" />
                        <span className="sr-only">History</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">History</TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                     <Link
                        href="/about"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Info className="h-5 w-5" />
                        <span className="sr-only">About</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">About</TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                     <Link
                        href="/contact"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Mail className="h-5 w-5" />
                        <span className="sr-only">Contact</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Contact</TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ModeToggle />
      </nav>
    </aside>
  );
}
