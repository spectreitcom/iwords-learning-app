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
              <Link href={`/boxes/${boxItem.boxId}`}>{boxItem.title}</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
        {(isPending || isLoading || isFetching) && <Spinner />}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
