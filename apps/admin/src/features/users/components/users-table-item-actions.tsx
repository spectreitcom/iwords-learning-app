"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/features/users/types";
import { blockUser, unblockUser } from "@/features/users/actions";

type Props = Readonly<{
  user: User;
}>;

export function UsersTableItemActions({ user }: Props) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/*<DropdownMenuItem>Edytuj</DropdownMenuItem>*/}
          {user.blocked ? (
            <DropdownMenuItem
              variant={"default"}
              onClick={() => setShowAlert(true)}
            >
              Odblokuj
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              variant={"destructive"}
              onClick={() => setShowAlert(true)}
            >
              Blokuj
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Alert user={user} open={showAlert} onClose={() => setShowAlert(false)} />
    </>
  );
}

function Alert({
  open,
  onClose,
  user,
}: Props & { open: boolean; onClose: () => void }) {
  const [pending, setPending] = useState(false);

  const handle = async () => {
    setPending(true);
    if (user.blocked) {
      await unblockUser(user.userId);
    } else {
      await blockUser(user.userId);
    }
    setPending(false);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz{" "}
            {user.blocked ? "odblokować" : "zablokować"} użytkownika {user.name}
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja zmieni status użytkownika w systemie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction onClick={handle} disabled={pending}>
            {user.blocked ? "Odblokuj" : "Blokuj"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
