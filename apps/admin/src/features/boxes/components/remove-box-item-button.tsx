"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { removeItemFromBox } from "@/features/boxes/actions";
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

type Props = Readonly<{
  boxId: string;
  expressionContextId: string;
  phrase: string;
  translation: string;
}>;

export function RemoveBoxItemButton({
  boxId,
  expressionContextId,
  phrase,
  translation,
}: Props) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <Button
        size={"sm"}
        variant={"destructive"}
        onClick={() => setShowAlert(true)}
      >
        <Trash2Icon />
      </Button>

      <Alert
        boxId={boxId}
        expressionContextId={expressionContextId}
        phrase={phrase}
        translation={translation}
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
}

function Alert({
  open,
  onClose,
  boxId,
  expressionContextId,
  phrase,
  translation,
}: Props & Readonly<{ open: boolean; onClose: () => void }>) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    await removeItemFromBox(boxId, expressionContextId);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz usunąć {phrase} - {translation} z boxa?
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
          <AlertDialogAction onClick={handleDelete} loading={removing}>
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
