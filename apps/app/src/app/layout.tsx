import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider } from "@/services/clerk/components/clerk-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryClientProvider } from "@/services/tanstack/components/query-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <SidebarProvider>
              <AppSidebar />
              <div className={"w-full"}>
                <div>Topbar</div>
                <main className={"p-8"}>{children}</main>
              </div>
            </SidebarProvider>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
