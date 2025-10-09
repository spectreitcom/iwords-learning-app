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
import { AdminUser } from "@/features/admin-users/types";
import {
  blockAdminUser,
  unblockAdminUser,
} from "@/features/admin-users/actions";

type Props = {
  adminUser: AdminUser;
};

export function AdminUsersTableItemActions({ adminUser }: Props) {
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
          <DropdownMenuItem>Edytuj</DropdownMenuItem>
          {adminUser.blocked ? (
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

      <Alert
        adminUser={adminUser}
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
}

function Alert({
  open,
  onClose,
  adminUser,
}: Props & { open: boolean; onClose: () => void }) {
  const [pending, setPending] = useState(false);

  const handle = async () => {
    setPending(true);
    if (adminUser.blocked) {
      await unblockAdminUser(adminUser.adminUserId);
    } else {
      await blockAdminUser(adminUser.adminUserId);
    }
    setPending(false);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz usunąć administratora {adminUser.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja nie może zostać cofnięta. Dane zostaną usunięte
            permanentnie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction onClick={handle} disabled={pending}>
            {adminUser.blocked ? "Odblokuj" : "Blokuj"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
