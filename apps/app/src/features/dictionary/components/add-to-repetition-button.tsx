"use client";

import { useTransition } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { addExpressionContextToRepetition } from "@/features/repetitions/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type Props = Readonly<{
  expressionContextId: string;
}>;

export function AddToRepetitionButton({ expressionContextId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleAddExpressionContextToRepetition = () => {
    startTransition(async () => {
      try {
        await addExpressionContextToRepetition(expressionContextId);
        toast.success("Wyrażenie dodane do powtórek");
      } catch {
        toast.error("Wystąpił błąd podczas dodawania wyrażenia do powtórek");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      loading={isPending}
      onClick={handleAddExpressionContextToRepetition}
    >
      {!isPending && <Plus />}
      {isPending ? "Dodawanie..." : "Dodaj do powtórek"}
    </Button>
  );
}
