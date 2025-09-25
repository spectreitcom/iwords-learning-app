"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
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
import { useState } from "react";
import { deleteExpression } from "@/features/dictionary/actions";

type Props = {
  expressionId: string;
  phrase: string;
};

export function ExpressionTableItemActions({ expressionId, phrase }: Props) {
  const [open, setOpen] = useState(false);

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
          <DropdownMenuItem
            variant={"destructive"}
            onClick={() => setOpen(true)}
          >
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Alert
        open={open}
        expressionId={expressionId}
        phrase={phrase}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function Alert({
  open,
  onClose,
  phrase,
  expressionId,
}: Props & { open: boolean; onClose: () => void }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    await deleteExpression(expressionId);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz usunąć wyrażenie - {phrase}?
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
