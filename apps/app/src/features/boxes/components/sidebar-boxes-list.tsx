"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@repo/ui/components/ui/sidebar";
import Link from "next/link";
import { useBoxesListQuery } from "@/features/boxes/hooks";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { usePathname } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Badge } from "@repo/ui/components/ui/badge";

export function SidebarBoxesList() {
  const {
    data,
    isFetching,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBoxesListQuery();
  const pathname = usePathname();

  const boxes = data?.pages.flatMap((page) => page.data) || [];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton>Boxy</SidebarMenuButton>
      <SidebarMenuSub>
        {boxes.map((boxItem) => (
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
        {hasNextPage && (
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs text-muted-foreground hover:text-foreground justify-center"
            >
              {isFetchingNextPage ? <Spinner /> : "Załaduj więcej"}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )}
        {(isPending || isLoading || (isFetching && !isFetchingNextPage)) && (
          <Spinner />
        )}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
