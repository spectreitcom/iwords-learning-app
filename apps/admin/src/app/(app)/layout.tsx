import { PropsWithChildren } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/top-bar";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className={"w-full"}>
        <TopBar />
        <main className={"p-8 w-full"}>{children}</main>
      </div>
    </SidebarProvider>
  );
}
