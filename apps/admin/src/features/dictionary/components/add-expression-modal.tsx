"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { createExpression } from "@/features/dictionary/actions";
import { useState } from "react";
import { CreateExpressionForm } from "@/features/dictionary/components/create-expression-form";
import { toast } from "sonner";

export function AddExpressionModal() {
  const [show, setShow] = useState(false);
  const [existingExpressionId, setExistingExpressionId] = useState<
    string | null
  >(null);
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button>Nowe wyrażenie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowe wyrażenie</DialogTitle>
        </DialogHeader>
        <CreateExpressionForm
          pending={pending}
          onSubmitted={async (data) => {
            try {
              setPending(true);
              const responseData = await createExpression(data);
              setPending(false);
              if (responseData.existingExpressionId) {
                setExistingExpressionId(responseData.existingExpressionId);
                toast.error("To wyrażenie już istnieje");
                return;
              }
              if (responseData.expressionId) {
                toast.success("Wyrażenie zostało dodane");
                setShow(false);
              }
            } catch {
              setPending(false);
              toast.error("Wystąpił błąd podczas dodawania wyrażenia");
            }
          }}
          showInfoPanel={!!existingExpressionId}
        />
      </DialogContent>
    </Dialog>
  );
}
