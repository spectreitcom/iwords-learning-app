"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createExpression } from "@/features/dictionary/actions";
import { useState } from "react";
import { CreateExpressionForm } from "@/features/dictionary/components/create-expression-form";

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
            setPending(true);
            const responseData = await createExpression(data);
            setPending(false);
            if (responseData.existingExpressionId) {
              setExistingExpressionId(responseData.existingExpressionId);
              return;
            }
            if (responseData.expressionId) {
              setShow(false);
            }
          }}
          showInfoPanel={!!existingExpressionId}
        />
      </DialogContent>
    </Dialog>
  );
}
