"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/features/notes/actions";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

export function NewNoteButton({
  expressionContextId,
}: {
  expressionContextId: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(() => {
    const today = new Date().toLocaleDateString("pl-PL");
    return `Nowa notatka ${today}`;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const { noteId } = await createNote(expressionContextId, title);
      setIsOpen(false);
      router.push(`/expression-context/${expressionContextId}/notes/${noteId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nowa notatka</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz nową notatkę</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <Label htmlFor="title">Tytuł</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            placeholder="Wpisz tytuł notatki"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Anuluj
          </Button>
          <Button
            onClick={handleCreate}
            loading={isLoading}
            disabled={!title.trim()}
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
