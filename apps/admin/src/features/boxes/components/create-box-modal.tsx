"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateBoxForm } from "@/features/boxes/components/create-box-form";
import { createBox } from "@/features/boxes/actions";

export function CreateBoxModal() {
  const [show, setShow] = useState(false);

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
          onSubmitted={async (data) => {
            await createBox(data);
            setShow(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
