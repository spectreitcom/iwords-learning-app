"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
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
} from "@repo/ui/components/ui/alert-dialog";
import { useState } from "react";
import { deleteExpression } from "@/features/dictionary/actions";
import { EditExpressionModal } from "@/features/dictionary/components/edit-expression-modal";
import { Expression } from "@/features/dictionary/types";
import { toast } from "sonner";

type Props = Readonly<{
  expression: Expression;
}>;

export function ExpressionTableItemActions({ expression }: Props) {
  const [open, setOpen] = useState(false);
  const [showEditExpressionModal, setShowEditExpressionModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditExpressionModal(true)}>
            Edytuj
          </DropdownMenuItem>
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
        expression={expression}
        onClose={() => setOpen(false)}
      />
      <EditExpressionModal
        expression={expression}
        open={showEditExpressionModal}
        onClose={() => setShowEditExpressionModal(false)}
      />
    </>
  );
}

function Alert({
  open,
  onClose,
  expression,
}: Props & { open: boolean; onClose: () => void }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    try {
      setRemoving(true);
      await deleteExpression(expression.expressionId);
      toast.success("Wyrażenie zostało usunięte");
    } catch (error) {
      setRemoving(false);
      toast.error("Wystąpił błąd podczas usuwania wyrażenia");
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz usunąć wyrażenie - {expression.phrase}?
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
