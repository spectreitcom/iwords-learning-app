"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateBox } from "@/features/boxes/actions";
import { CreateBoxForm } from "@/features/boxes/components/create-box-form";
import { Box } from "@/features/boxes/types";

type Props = {
  box: Box;
  open: boolean;
  onClose: () => void;
};

export function EditBoxModal({ box, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj - {box.title}</DialogTitle>
        </DialogHeader>
        <CreateBoxForm
          defaultValues={{ ...box }}
          onSubmitted={async (data) => {
            await updateBox(box.boxId, data);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
