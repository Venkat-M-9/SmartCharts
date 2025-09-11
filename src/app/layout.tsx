
import type {Metadata} from 'next';
import { Inter } from "next/font/google";
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundAnimation } from '@/components/background-animation';
import { MainNav } from '@/components/main-nav';

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
          <BackgroundAnimation />
          <div className="flex min-h-screen w-full flex-col bg-background/80 backdrop-blur-sm relative">
            <MainNav />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 z-10">
                {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
