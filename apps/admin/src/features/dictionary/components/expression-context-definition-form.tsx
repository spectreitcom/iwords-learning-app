"use client";

import {
  CreateExpressionContextDefinitionData,
  createExpressionContextDefinitionSchema,
} from "@/features/dictionary/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  generateExpressionContextDefinition,
  updateExpressionContextDefinition,
} from "@/features/dictionary/actions";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  defaultValues?: CreateExpressionContextDefinitionData;
  expressionContextId: string;
};

export function ExpressionContextDefinitionForm({
  defaultValues,
  expressionContextId,
}: Props) {
  const [generatingDefinition, setGeneratingDefinition] = useState(false);

  const form = useForm<CreateExpressionContextDefinitionData>({
    resolver: zodResolver(createExpressionContextDefinitionSchema),
    defaultValues: {
      definition: defaultValues?.definition ?? "",
      definitionTranslation: defaultValues?.definitionTranslation ?? "",
    },
  });

  const submit = async (data: CreateExpressionContextDefinitionData) => {
    await updateExpressionContextDefinition(expressionContextId, data);
  };

  const handleGenerateDefinition = async () => {
    try {
      setGeneratingDefinition(true);
      const { definition, translation } =
        await generateExpressionContextDefinition(expressionContextId);
      form.reset({
        definition,
        definitionTranslation: translation,
      });
    } catch {
      toast.error(`Wystąpił błąd podczas generowania definicji`);
    } finally {
      setGeneratingDefinition(false);
    }
  };

  return (
    <>
      <div className={"flex justify-end"}>
        <Button
          onClick={handleGenerateDefinition}
          disabled={generatingDefinition}
        >
          Wygeneruj definicję
        </Button>
      </div>
      <Form {...form}>
        <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Definicja</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={generatingDefinition} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"definition"}
            control={form.control}
          />
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tłumaczenie</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={generatingDefinition} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"definitionTranslation"}
            control={form.control}
          />
          <div className={"flex justify-end"}>
            <Button
              className={"btn btn-primary"}
              type={"submit"}
              disabled={form.formState.isSubmitting || generatingDefinition}
            >
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
