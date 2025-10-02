import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/session";

export async function TopBar() {
  const session = await getSession();
  return (
    <div className={"p-4 flex justify-end items-center gap-2"}>
      <div className={"text-sm"}>Witaj, {session?.name}</div>
      <Button variant={"ghost"} size={"sm"} asChild>
        <Link href={"/api/auth/sign-out"}>Sign out</Link>
      </Button>
    </div>
  );
}
