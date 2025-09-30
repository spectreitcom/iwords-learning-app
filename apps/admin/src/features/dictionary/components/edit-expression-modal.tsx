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

type Props = {
  expression: Expression;
  open: boolean;
  onClose: () => void;
};

export function EditExpressionModal({ expression, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj - {expression.phrase}</DialogTitle>
        </DialogHeader>
        <CreateExpressionForm
          defaultValues={{ ...expression }}
          onSubmitted={async (data) => {
            await updateExpression(expression.expressionId, data);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
