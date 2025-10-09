import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function TopBar() {
  const session = await getSession();
  return (
    <div className={"p-4 flex justify-end items-center gap-2"}>
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
