import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider } from "@/services/clerk/components/clerk-provider";
import { SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryClientProvider } from "@/services/tanstack/components/query-client-provider";
import { Topbar } from "@/components/topbar";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "iWords - Nauka języka angielskiego",
  description:
    "Efektywna platforma do nauki języka angielskiego. Rozwijaj swoje słownictwo, ćwicz wymowę i ucz się nowych słów w intuicyjny sposób.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <AppSidebar />
                <div className={"w-full"}>
                  <Topbar />
                  <main className={"p-8"}>{children}</main>
                  <Toaster position={"top-center"} />
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
