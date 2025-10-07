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
import { InviteAdminUserForm } from "@/features/admin-users/components/invite-admin-user-form";
import { inviteAdminUser } from "@/features/admin-users/actions";

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
            await inviteAdminUser(data);
            setShow(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
