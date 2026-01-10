"use client";

import { useAuth } from "@clerk/nextjs";
import { CurrentLoggedUser } from "@/features/auth/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "admin/src/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = Readonly<{
  loggedUser: CurrentLoggedUser;
}>;

export function UserDropdownMenu({ loggedUser }: Props) {
  const { signOut } = useAuth();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className={"capitalize"} asChild>
          <Button size={"sm"} variant={"ghost"}>
            {loggedUser.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"w-56"}>
          <DropdownMenuItem onClick={() => signOut()}>Wyloguj</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
