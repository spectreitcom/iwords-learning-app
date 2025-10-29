"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateExpression } from "@/features/dictionary/actions";
import { CreateExpressionForm } from "@/features/dictionary/components/create-expression-form";
import { Expression } from "@/features/dictionary/types";
import { useState } from "react";

type Props = {
  expression: Expression;
  open: boolean;
  onClose: () => void;
};

export function EditExpressionModal({ expression, open, onClose }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj - {expression.phrase}</DialogTitle>
        </DialogHeader>
        <CreateExpressionForm
          defaultValues={{ ...expression }}
          pending={pending}
          onSubmitted={async (data) => {
            setPending(true);
            await updateExpression(expression.expressionId, data);
            setPending(false);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
