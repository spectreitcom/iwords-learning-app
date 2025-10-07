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
import { Box } from "@/features/boxes/types";
import { deleteBox } from "@/features/boxes/actions";
import { EditBoxModal } from "@/features/boxes/components/edit-box-modal";

type Props = {
  box: Box;
};

export function BoxesTableItemActions({ box }: Props) {
  const [showAlert, setShowAlert] = useState(false);
  const [showEditBoxModal, setShowEditBoxModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditBoxModal(true)}>
            Edytuj
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={"destructive"}
            onClick={() => setShowAlert(true)}
          >
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Alert box={box} open={showAlert} onClose={() => setShowAlert(false)} />
      <EditBoxModal
        box={box}
        open={showEditBoxModal}
        onClose={() => setShowEditBoxModal(false)}
      />
    </>
  );
}

function Alert({
  open,
  onClose,
  box,
}: Props & { open: boolean; onClose: () => void }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    await deleteBox(box.boxId);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz box
            {box.title}?
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
          <AlertDialogAction onClick={handleDelete} disabled={removing}>
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
