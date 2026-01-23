"use client";

import { Button } from "@repo/ui/components/ui/button";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { beginBox } from "@/features/learning/actions";

type Props = Readonly<{
  isBoxStarted: boolean;
  boxId: string;
  disabled?: boolean;
}>;

export function StartLearningButton({ isBoxStarted, boxId, disabled }: Props) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (boxId: string) => beginBox(boxId),
  });

  const handleClick = async () => {
    await mutateAsync(boxId);
    redirect(`/learning/${boxId}`);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending || disabled}
      variant={"shine"}
      size={"lg"}
      className="shadow-md"
    >
      {isBoxStarted ? "Kontynuuj naukę" : "Rozpocznij naukę"}
    </Button>
  );
}
