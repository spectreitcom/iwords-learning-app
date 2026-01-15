"use client";

import {
  ExpressionContext,
  ExpressionContextDetails,
} from "@/features/dictionary/types";
import { ReactNode, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteExpressionContext,
  getExpressionContextDetails,
  updateAdjectiveExpressionContext,
  updateAdverbExpressionContext,
  updateIrregularVerbExpressionContext,
  updateNounExpressionContext,
  updatePhrasalAdverbExpressionContext,
  updateSimpleExpressionExpressionContext,
  updateVerbExpressionContext,
} from "@/features/dictionary/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateOnlyTranslationExpressionContextForm } from "@/features/dictionary/components/create-only-translation-expression-context-form";
import { CreateNounExpressionContextForm } from "@/features/dictionary/components/create-noun-translation-expression-context-form";
import { CreateIrregularVerbExpressionContextForm } from "@/features/dictionary/components/create-irregular-verb-expression-context-form";
import Link from "next/link";

type Props = Readonly<{
  expressionContext: ExpressionContext;
}>;

export function ExpressionContextsTableItemActions({
  expressionContext,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showEditVerbModal, setShowEditVerbModal] = useState(false);
  const [showEditAdjectiveModal, setShowEditAdjectiveModal] = useState(false);
  const [showEditAdverbModal, setShowEditAdverbModal] = useState(false);
  const [showEditPhrasalVerbModal, setShowEditPhrasalVerbModal] =
    useState(false);
  const [showEditNounModal, setShowEditNounModal] = useState(false);
  const [showEditIrregularVerbModal, setShowEditIrregularVerbModal] =
    useState(false);
  const [showEditSimpleExpressionModal, setShowEditSimpleExpressionModal] =
    useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {expressionContext.type === "verb" && (
            <DropdownMenuItem onClick={() => setShowEditVerbModal(true)}>
              Edytuj
            </DropdownMenuItem>
          )}
          {expressionContext.type === "adjective" && (
            <DropdownMenuItem onClick={() => setShowEditAdjectiveModal(true)}>
              Edytuj
            </DropdownMenuItem>
          )}
          {expressionContext.type === "adverb" && (
            <DropdownMenuItem onClick={() => setShowEditAdverbModal(true)}>
              Edytuj
            </DropdownMenuItem>
          )}
          {expressionContext.type === "phrasal_verb" && (
            <DropdownMenuItem onClick={() => setShowEditPhrasalVerbModal(true)}>
              Edytuj
            </DropdownMenuItem>
          )}
          {expressionContext.type === "noun" && (
            <DropdownMenuItem onClick={() => setShowEditNounModal(true)}>
              Edytuj
            </DropdownMenuItem>
          )}
          {expressionContext.type === "irregular_verb" && (
            <DropdownMenuItem
              onClick={() => setShowEditIrregularVerbModal(true)}
            >
              Edytuj
            </DropdownMenuItem>
          )}
          {expressionContext.type === "simple_expression" && (
            <DropdownMenuItem
              onClick={() => setShowEditSimpleExpressionModal(true)}
            >
              Edytuj
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={`/expressions/${expressionContext.expressionId}/context/${expressionContext.expressionContextId}/definition`}
            >
              Definicja
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={"destructive"}
            onClick={() => setOpen(true)}
          >
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditVerbModal
        expressionContextId={expressionContext.expressionContextId}
        open={showEditVerbModal}
        onClose={() => setShowEditVerbModal(false)}
      />

      <EditAdjectiveModal
        open={showEditAdjectiveModal}
        expressionContextId={expressionContext.expressionContextId}
        onClose={() => setShowEditAdjectiveModal(false)}
      />

      <EditAdverbModal
        open={showEditAdverbModal}
        expressionContextId={expressionContext.expressionContextId}
        onClose={() => setShowEditAdverbModal(false)}
      />

      <EditPhrasalVerbModal
        open={showEditPhrasalVerbModal}
        expressionContextId={expressionContext.expressionContextId}
        onClose={() => setShowEditPhrasalVerbModal(false)}
      />

      <EditNounModal
        open={showEditNounModal}
        expressionContextId={expressionContext.expressionContextId}
        onClose={() => setShowEditNounModal(false)}
      />

      <EditIrregularVerbModal
        open={showEditIrregularVerbModal}
        expressionContextId={expressionContext.expressionContextId}
        onClose={() => setShowEditIrregularVerbModal(false)}
      />

      <EditSimpleExpressionModal
        open={showEditSimpleExpressionModal}
        expressionContextId={expressionContext.expressionContextId}
        onClose={() => setShowEditSimpleExpressionModal(false)}
      />

      <Alert
        open={open}
        onClose={() => setOpen(false)}
        expressionContext={expressionContext}
      />
    </>
  );
}

type ModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}>;

function Modal({ open, onClose, title, children }: ModalProps) {
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

function EditVerbModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja czasownika"}>
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateOnlyTranslationExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updateVerbExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function EditIrregularVerbModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Edycja czasownika nieregularnego"}
    >
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateIrregularVerbExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
            form1: expressionContextDetails?.forms?.at(0) ?? "",
            form2: expressionContextDetails?.forms?.at(1) ?? "",
            form3: expressionContextDetails?.forms?.at(2) ?? "",
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updateIrregularVerbExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function EditNounModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja rzeczownika"}>
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateNounExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
            isCountable: expressionContextDetails.isCountable,
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updateNounExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function EditPhrasalVerbModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja czasownika frazowego"}>
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateOnlyTranslationExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updatePhrasalAdverbExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function EditAdverbModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja przysłówka"}>
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateOnlyTranslationExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updateAdverbExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function EditSimpleExpressionModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja prostego wyrażenia"}>
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateOnlyTranslationExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updateSimpleExpressionExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function EditAdjectiveModal({
  open,
  onClose,
  expressionContextId,
}: Omit<ModalProps, "title" | "children"> & { expressionContextId: string }) {
  const [expressionContextDetails, setExpressionContextDetails] =
    useState<ExpressionContextDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open && expressionContextId) {
      getExpressionContextDetails(expressionContextId)
        .then((expressionContextDetails) => {
          setExpressionContextDetails(expressionContextDetails);
        })
        .finally(() => setLoading(false));
    }
  }, [open, expressionContextId]);

  return (
    <Modal open={open} onClose={onClose} title={"Edycja przymiotnika"}>
      {loading && <ModalLoader />}

      {expressionContextDetails && !loading && (
        <CreateOnlyTranslationExpressionContextForm
          pending={pending || loading}
          defaultValues={{
            translation: expressionContextDetails.translation,
          }}
          onSubmitted={async (data) => {
            setPending(true);
            await updateAdjectiveExpressionContext(
              expressionContextId,
              expressionContextDetails.expressionId,
              data,
            );
            setPending(false);
            setExpressionContextDetails(null);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function ModalLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Alert({
  open,
  onClose,
  expressionContext,
}: Props & { open: boolean; onClose: () => void }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    await deleteExpressionContext(expressionContext.expressionContextId);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy jesteś pewien, że chcesz usunąć kontekst -{" "}
            {expressionContext.translation}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja nie może zostać cofnięta. Dane zostaną usunięte
            permanentnie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} loading={removing}>
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
