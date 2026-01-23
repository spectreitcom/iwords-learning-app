"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { CreateBoxForm } from "@/features/boxes/components/create-box-form";
import { createBox } from "@/features/boxes/actions";
import { toast } from "sonner";

export function CreateBoxModal() {
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button>Nowy box</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy box</DialogTitle>
        </DialogHeader>
        <CreateBoxForm
          pending={pending}
          onSubmitted={async (data) => {
            try {
              setPending(true);
              await createBox(data);
              toast.success("Box został utworzony");
              setShow(false);
              setPending(false);
            } catch {
              setPending(false);
              toast.error("Wystąpił błąd podczas tworzenia boxa");
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
