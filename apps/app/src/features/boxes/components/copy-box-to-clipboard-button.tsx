"use client";

import { Button } from "@repo/ui/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

type Props = Readonly<{
  items: { phrase: string; translation: string }[];
}>;

export function CopyBoxToClipboardButton({ items }: Props) {
  const handleClick = () => {
    const text = items
      .map((item) => `${item.phrase} - ${item.translation}`)
      .join("\n");

    globalThis.navigator.clipboard.writeText(text);
    toast.success("Wyrażenia skopiowano do schowka!");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={"ghost"} onClick={handleClick}>
          <ClipboardCopy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Skopiuj wyrażenia do schowka</TooltipContent>
    </Tooltip>
  );
}
