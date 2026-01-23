"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { CreateOnlyTranslationExpressionContextForm } from "@/features/dictionary/components/create-only-translation-expression-context-form";
import {
  createAdjectiveExpressionContext,
  createAdverbExpressionContext,
  createIrregularVerbExpressionContext,
  createNounExpressionContext,
  createPhrasalVerbExpressionContext,
  createSimpleExpressionExpressionContext,
  createVerbExpressionContext,
} from "@/features/dictionary/actions";
import { CreateNounExpressionContextForm } from "@/features/dictionary/components/create-noun-translation-expression-context-form";
import { CreateIrregularVerbExpressionContextForm } from "@/features/dictionary/components/create-irregular-verb-expression-context-form";
import { toast } from "sonner";

type Props = Readonly<{
  expressionId: string;
}>;

export function AddExpressionContextMenu({ expressionId }: Props) {
  const [showAddVerbModal, setShowAddVerbModal] = useState(false);
  const [showAddAdjectiveModal, setShowAddAdjectiveModal] = useState(false);
  const [showAddPhrasalVerbModal, setShowAddPhrasalVerbModal] = useState(false);
  const [showAddAdverbModal, setShowAddAdverbModal] = useState(false);
  const [showAddNounModal, setShowAddNounModal] = useState(false);
  const [showAddIrregularVerbModal, setShowAddIrregularVerbModal] =
    useState(false);
  const [showAddSimpleExpressionModal, setShowAddSimpleExpressionModal] =
    useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Dodaj kontekst</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowAddVerbModal(true)}>
            Czasownik
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAddPhrasalVerbModal(true)}>
            Czasownik frazowy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAddNounModal(true)}>
            Rzeczownik
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAddAdjectiveModal(true)}>
            Przymiotnik
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAddAdverbModal(true)}>
            Przysłówek
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAddIrregularVerbModal(true)}>
            Czasownik nieregularny
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowAddSimpleExpressionModal(true)}
          >
            Wyrażenie
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddVerbModal
        open={showAddVerbModal}
        onClose={() => setShowAddVerbModal(false)}
        expressionId={expressionId}
      />

      <AddAdjectiveModal
        open={showAddAdjectiveModal}
        onClose={() => setShowAddAdjectiveModal(false)}
        expressionId={expressionId}
      />

      <AddPhrasalVerbModal
        open={showAddPhrasalVerbModal}
        onClose={() => setShowAddPhrasalVerbModal(false)}
        expressionId={expressionId}
      />

      <AddAdverbModal
        open={showAddAdverbModal}
        onClose={() => setShowAddAdverbModal(false)}
        expressionId={expressionId}
      />

      <AddNounModal
        open={showAddNounModal}
        onClose={() => setShowAddNounModal(false)}
        expressionId={expressionId}
      />

      <AddIrregularVerbModal
        open={showAddIrregularVerbModal}
        expressionId={expressionId}
        onClose={() => setShowAddIrregularVerbModal(false)}
      />

      <AddSimpleExpressionModal
        open={showAddSimpleExpressionModal}
        expressionId={expressionId}
        onClose={() => setShowAddSimpleExpressionModal(false)}
      />
    </>
  );
}

type DialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}>;

function Modal({ open, onClose, title, children }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function AddVerbModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj czasownik"}>
      <CreateOnlyTranslationExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createVerbExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Czasownik został dodany");
            onClose();
          } catch {
            setPending(false);
            toast.error("Wystąpił błąd podczas dodawania czasownika");
          }
        }}
      />
    </Modal>
  );
}

function AddPhrasalVerbModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj czasownik frazowy"}>
      <CreateOnlyTranslationExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createPhrasalVerbExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Czasownik frazowy został dodany");
            onClose();
          } catch {
            setPending(false);
            toast.error("Wystąpił błąd podczas dodawania czasownika frazowego");
          }
        }}
      />
    </Modal>
  );
}

function AddNounModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj rzeczownik"}>
      <CreateNounExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createNounExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Rzeczownik został dodany");
            onClose();
          } catch {
            setPending(false);
            toast.error("Wystąpił błąd podczas dodawania rzeczownika");
          }
        }}
      />
    </Modal>
  );
}

function AddAdverbModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj przysłówek"}>
      <CreateOnlyTranslationExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createAdverbExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Przysłówek został dodany");
            onClose();
          } catch {
            setPending(false);
            toast.error("Wystąpił błąd podczas dodawania przysłówka");
          }
        }}
      />
    </Modal>
  );
}

function AddIrregularVerbModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj czasownik nieregularny"}>
      <CreateIrregularVerbExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createIrregularVerbExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Czasownik nieregularny został dodany");
            onClose();
          } catch {
            setPending(false);
            toast.error(
              "Wystąpił błąd podczas dodawania czasownika nieregularnego",
            );
          }
        }}
      />
    </Modal>
  );
}

function AddAdjectiveModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj przymiotnik"}>
      <CreateOnlyTranslationExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createAdjectiveExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Przymiotnik został dodany");
            onClose();
          } catch {
            setPending(false);
            toast.error("Wystąpił błąd podczas dodawania przymiotnika");
          }
        }}
      />
    </Modal>
  );
}

function AddSimpleExpressionModal({
  open,
  onClose,
  expressionId,
}: Readonly<
  Omit<DialogProps, "title" | "children"> & { expressionId: string }
>) {
  const [pending, setPending] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={"Dodaj proste wyrażenie"}>
      <CreateOnlyTranslationExpressionContextForm
        pending={pending}
        onSubmitted={async (data) => {
          try {
            setPending(true);
            await createSimpleExpressionExpressionContext(expressionId, data);
            setPending(false);
            toast.success("Wyrażenie zostało dodane");
            onClose();
          } catch {
            setPending(false);
            toast.error("Wystąpił błąd podczas dodawania wyrażenia");
          }
        }}
      />
    </Modal>
  );
}
