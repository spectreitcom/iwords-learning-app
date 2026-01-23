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
import { InviteAdminUserForm } from "@/features/admin-users/components/invite-admin-user-form";
import { inviteAdminUser } from "@/features/admin-users/actions";
import { toast } from "sonner";

export function InviteAdminUserModal() {
  const [show, setShow] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button>Nowy admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowego administratora</DialogTitle>
        </DialogHeader>
        <InviteAdminUserForm
          onSubmitted={async (data) => {
            try {
              await inviteAdminUser(data);
              toast.success("Administrator został zaproszony");
              setShow(false);
            } catch (error) {
              toast.error("Wystąpił błąd podczas zapraszania administratora");
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
