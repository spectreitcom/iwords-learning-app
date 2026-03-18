"use client";

import { Button } from "@repo/ui/components/ui/button";
import { usePronunciation } from "@/hooks/use-pronunciation";
import { Volume2 } from "lucide-react";

type Props = Readonly<{
  text: string;
}>;

export function PronunciationButton({ text }: Props) {
  const { isAvailable, speak, isSpeaking } = usePronunciation("en-US");

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => speak(text)}
      disabled={!isAvailable || isSpeaking}
      title="Pronounce"
      className={"cursor-pointer"}
    >
      <Volume2 />
    </Button>
  );
}
