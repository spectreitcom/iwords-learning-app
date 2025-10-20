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

export function SidebarBoxesList() {
  const { data, isFetching, isLoading, isPending } = useBoxesListQuery();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton>Boxy</SidebarMenuButton>
      <SidebarMenuSub>
        {data?.data.map((boxItem) => (
          <SidebarMenuSubItem key={boxItem.boxId}>
            <SidebarMenuSubButton asChild>
              <Link href={`/boxes/${boxItem.boxId}`}>{boxItem.title}</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
        {(isPending || isLoading || isFetching) && <Spinner />}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
