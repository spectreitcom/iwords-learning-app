"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { deleteNote } from "@/features/notes/actions";
import { useTransition } from "react";
import { cn } from "@repo/ui/lib/utils";

type Props = Readonly<{
  noteId: string;
  expressionContextId: string;
  className?: string;
}>;

export function NoteItemDropdownMenu({
  noteId,
  expressionContextId,
  className,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Czy na pewno chcesz usunąć tę notatkę?")) {
      startTransition(async () => {
        await deleteNote(expressionContextId, noteId);
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isPending && "opacity-100",
            className,
          )}
          aria-label="Akcje notatki"
          disabled={isPending}
        >
          <MoreVertical className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Usuń notatkę
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
