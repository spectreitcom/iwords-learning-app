"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useBoxesListQuery } from "@/features/boxes/hooks";
import { Spinner } from "@/components/ui/spinner";
import { usePathname } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SidebarBoxesList() {
  const { data, isFetching, isLoading, isPending } = useBoxesListQuery();
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton>Boxy</SidebarMenuButton>
      <SidebarMenuSub>
        {data?.data.map((boxItem) => (
          <SidebarMenuSubItem key={boxItem.boxId}>
            <SidebarMenuSubButton
              asChild
              isActive={pathname.includes(`/boxes/${boxItem.boxId}`)}
            >
              <Link
                href={`/boxes/${boxItem.boxId}`}
                className={
                  "flex justify-between items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/60 dark:hover:bg-accent/30"
                }
              >
                <div className="flex items-center gap-2">
                  {boxItem.title}
                  {boxItem.isNew && (
                    <Badge
                      variant="default"
                      className="h-4 px-1 text-[10px] bg-blue-500 hover:bg-blue-600"
                    >
                      Nowy
                    </Badge>
                  )}
                  {!boxItem.isAlreadyStarted && (
                    <Badge
                      variant="secondary"
                      className="h-4 px-1 text-[10px] bg-amber-500 text-white hover:bg-amber-600"
                    >
                      Nie rozpoczęty
                    </Badge>
                  )}
                </div>
                {boxItem.isFinished && (
                  <CheckCircle className={"stroke-green-600"} />
                )}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
        {(isPending || isLoading || isFetching) && <Spinner />}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
