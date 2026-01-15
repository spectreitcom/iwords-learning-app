"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { deleteSentence, updateSentence } from "@/features/dictionary/actions";
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
import { Sentence } from "@/features/dictionary/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateSentenceForm } from "@/features/dictionary/components/create-sentence-form";

type Props = Readonly<{
  sentence: Sentence;
  expressionId: string;
  expressionContextId: string;
}>;

export function SentencesTableItemActions({
  sentence,
  expressionContextId,
  expressionId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showEditSentenceModal, setShowEditSentenceModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditSentenceModal(true)}>
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
        onClose={() => setOpen(false)}
        sentence={sentence}
        expressionId={expressionId}
        expressionContextId={expressionContextId}
      />

      <EditModal
        open={showEditSentenceModal}
        onClose={() => setShowEditSentenceModal(false)}
        expressionId={expressionId}
        expressionContextId={expressionContextId}
        sentence={sentence}
      />
    </>
  );
}

function Alert({
  open,
  onClose,
  sentence,
  expressionId,
  expressionContextId,
}: Props & { open: boolean; onClose: () => void }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    await deleteSentence(
      sentence.sentenceId,
      expressionId,
      expressionContextId,
    );
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz usunąć zadanie - {sentence.content}?
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

type ModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}>;

function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function EditModal({
  open,
  onClose,
  expressionContextId,
  expressionId,
  sentence,
}: Omit<ModalProps, "title" | "children"> & {
  expressionContextId: string;
  expressionId: string;
  sentence: Sentence;
}) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja zdania"}>
      <CreateSentenceForm
        pending={pending}
        defaultValues={sentence}
        onSubmitted={async (data) => {
          setPending(true);
          await updateSentence(
            sentence.sentenceId,
            expressionId,
            expressionContextId,
            data,
          );
          setPending(false);
          onClose();
        }}
      />
    </Modal>
  );
}
