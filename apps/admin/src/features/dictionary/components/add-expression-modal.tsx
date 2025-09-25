"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateExpressionSchema,
  createExpressionSchema,
} from "@/features/dictionary/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createExpression } from "@/features/dictionary/actions";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export function AddExpressionModal() {
  const [show, setShow] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button>Nowe wyrażenie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowe wyrażenie</DialogTitle>
        </DialogHeader>
        <CreateExpressionForm onSuccess={() => setShow(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateExpressionForm({ onSuccess }: { onSuccess: () => void }) {
  const [existingExpressionId, setExistingExpressionId] = useState<
    string | null
  >(null);

  const form = useForm({
    resolver: zodResolver(createExpressionSchema),
    defaultValues: {
      phrase: "",
    },
  });

  const submit = async (data: CreateExpressionSchema) => {
    const responseData = await createExpression(data);
    if (responseData.existingExpressionId) {
      setExistingExpressionId(responseData.existingExpressionId);
      return;
    }
    if (responseData.expressionId) {
      onSuccess();
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
        {existingExpressionId && <InfoPanel phrase={form.getValues().phrase} />}

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fraza</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"phrase"}
          control={form.control}
        />

        <div className={"flex justify-end"}>
          <Button type={"submit"} disabled={form.formState.isSubmitting}>
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}

function InfoPanel({ phrase }: { phrase: string }) {
  return (
    <Alert variant={"destructive"}>
      <AlertTitle>Wyrażenie {phrase} już istnieje w bazie danych.</AlertTitle>
    </Alert>
  );
}
