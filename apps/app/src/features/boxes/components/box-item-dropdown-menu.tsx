"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { addExpressionContextToRepetition } from "@/features/repetitions/actions";
import { toast } from "sonner";

type Props = Readonly<{
  expressionContextId: string;
}>;

export function BoxItemDropdownMenu({ expressionContextId }: Props) {
  const handleAddToRepetitions = async () => {
    try {
      await addExpressionContextToRepetition(expressionContextId);
      toast.success("Wyrażenie dodane do powtórek");
    } catch {
      toast.error("Wystąpił błąd podczas dodawania wyrażenia do powtórek");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Akcje pozycji"
        >
          <MoreVertical className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/sentence-training/${expressionContextId}`}>
            Trenuj wyrażenie w zdaniach
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/expression-context/${expressionContextId}/notes`}>
            Notatki
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddToRepetitions}>
          Dodaj do powtórek
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
