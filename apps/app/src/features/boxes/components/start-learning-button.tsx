"use client";

import { Button } from "@/components/ui/button";
import { beginBox } from "@/features/boxes/actions";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

type Props = {
  isBoxStarted: boolean;
  boxId: string;
};

export function StartLearningButton({ isBoxStarted, boxId }: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (boxId: string) => beginBox(boxId),
  });

  const handleClick = async () => {
    await mutateAsync(boxId);
    redirect(`/learning/${boxId}`);
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isBoxStarted ? "Kontynuuj naukę" : "Rozpocznij naukę"}
    </Button>
  );
}
