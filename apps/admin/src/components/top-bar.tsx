import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { ModeToggle } from "@repo/ui/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

export async function TopBar() {
  const session = await getSession();
  return (
    <div className={"p-4 flex justify-end items-center gap-2"}>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            Witaj, {session?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/profile"}>Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/api/auth/sign-out"}>Wyloguj</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
