"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { CreateSentenceForm } from "@/features/dictionary/components/create-sentence-form";
import { createSentence } from "@/features/dictionary/actions";
import { toast } from "sonner";

type Props = Readonly<{
  expressionId: string;
  expressionContextId: string;
}>;

export function AddSentenceModal({ expressionContextId, expressionId }: Props) {
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button>Nowe zdanie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowe zdanie</DialogTitle>
        </DialogHeader>
        <CreateSentenceForm
          pending={pending}
          onSubmitted={async (data) => {
            try {
              setPending(true);
              await createSentence(expressionId, expressionContextId, data);
              toast.success("Zdanie zostało dodane");
              setPending(false);
              setShow(false);
            } catch (error) {
              setPending(false);
              toast.error("Wystąpił błąd podczas dodawania zdania");
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
