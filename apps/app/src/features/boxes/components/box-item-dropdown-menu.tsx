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

type Props = Readonly<{
  expressionContextId: string;
}>;

export function BoxItemDropdownMenu({ expressionContextId }: Props) {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
