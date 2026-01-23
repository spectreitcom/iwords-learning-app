"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { updateBox } from "@/features/boxes/actions";
import { CreateBoxForm } from "@/features/boxes/components/create-box-form";
import { Box } from "@/features/boxes/types";
import { useState } from "react";

type Props = Readonly<{
  box: Box;
  open: boolean;
  onClose: () => void;
}>;

export function EditBoxModal({ box, open, onClose }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj - {box.title}</DialogTitle>
        </DialogHeader>
        <CreateBoxForm
          defaultValues={{ ...box }}
          pending={pending}
          onSubmitted={async (data) => {
            setPending(true);
            await updateBox(box.boxId, data);
            setPending(false);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
