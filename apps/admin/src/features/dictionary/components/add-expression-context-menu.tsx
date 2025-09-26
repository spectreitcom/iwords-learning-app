"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateOnlyTranslationExpressionContextForm } from "@/features/dictionary/components/create-only-translation-expression-context-form";
import {
  createAdjectiveExpressionContext,
  createAdverbExpressionContext,
  createIrregularVerbExpressionContext,
  createNounExpressionContext,
  createPhrasalVerbExpressionContext,
  createVerbExpressionContext,
} from "@/features/dictionary/actions";
import { CreateNounExpressionContextForm } from "@/features/dictionary/components/create-noun-translation-expression-context-form";
import { CreateIrregularVerbExpressionContextForm } from "@/features/dictionary/components/create-irregular-verb-expression-context-form";

type Props = {
  expressionId: string;
};

export function AddExpressionContextMenu({ expressionId }: Props) {
  const [showAddVerbModal, setShowAddVerbModal] = useState(false);
  const [showAddAdjectiveModal, setShowAddAdjectiveModal] = useState(false);
  const [showAddPhrasalVerbModal, setShowAddPhrasalVerbModal] = useState(false);
  const [showAddAdverbModal, setShowAddAdverbModal] = useState(false);
  const [showAddNounModal, setShowAddNounModal] = useState(false);
  const [showAddIrregularVerbModal, setShowAddIrregularVerbModal] =
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
    </>
  );
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

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
}: Omit<DialogProps, "title" | "children"> & { expressionId: string }) {
  return (
    <Modal open={open} onClose={onClose} title={"Dodaj czasownik"}>
      <CreateOnlyTranslationExpressionContextForm
        expressionId={expressionId}
        onSubmitted={async (data) => {
          await createVerbExpressionContext(data);
          onClose();
        }}
      />
    </Modal>
  );
}

function AddPhrasalVerbModal({
  open,
  onClose,
  expressionId,
}: Omit<DialogProps, "title" | "children"> & { expressionId: string }) {
  return (
    <Modal open={open} onClose={onClose} title={"Dodaj czasownik frazowy"}>
      <CreateOnlyTranslationExpressionContextForm
        expressionId={expressionId}
        onSubmitted={async (data) => {
          await createPhrasalVerbExpressionContext(data);
          onClose();
        }}
      />
    </Modal>
  );
}

function AddNounModal({
  open,
  onClose,
  expressionId,
}: Omit<DialogProps, "title" | "children"> & { expressionId: string }) {
  return (
    <Modal open={open} onClose={onClose} title={"Dodaj rzeczownik"}>
      <CreateNounExpressionContextForm
        expressionId={expressionId}
        onSubmitted={async (data) => {
          await createNounExpressionContext(data);
          onClose();
        }}
      />
    </Modal>
  );
}

function AddAdverbModal({
  open,
  onClose,
  expressionId,
}: Omit<DialogProps, "title" | "children"> & { expressionId: string }) {
  return (
    <Modal open={open} onClose={onClose} title={"Dodaj przysłówek"}>
      <CreateOnlyTranslationExpressionContextForm
        expressionId={expressionId}
        onSubmitted={async (data) => {
          await createAdverbExpressionContext(data);
          onClose();
        }}
      />
    </Modal>
  );
}

function AddIrregularVerbModal({
  open,
  onClose,
  expressionId,
}: Omit<DialogProps, "title" | "children"> & { expressionId: string }) {
  return (
    <Modal open={open} onClose={onClose} title={"Dodaj czasownik nieregularny"}>
      <CreateIrregularVerbExpressionContextForm
        expressionId={expressionId}
        onSubmitted={async (data) => {
          await createIrregularVerbExpressionContext(data);
          onClose();
        }}
      />
    </Modal>
  );
}

function AddAdjectiveModal({
  open,
  onClose,
  expressionId,
}: Omit<DialogProps, "title" | "children"> & { expressionId: string }) {
  return (
    <Modal open={open} onClose={onClose} title={"Dodaj przymiotnik"}>
      <CreateOnlyTranslationExpressionContextForm
        expressionId={expressionId}
        onSubmitted={async (data) => {
          await createAdjectiveExpressionContext(data);
          onClose();
        }}
      />
    </Modal>
  );
}
