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
            setPending(true);
            await createSentence(expressionId, expressionContextId, data);
            setPending(false);
            setShow(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
