import {
  IrregularVerbAnswer,
  LearningViewType,
} from "@/features/learning/types";
import { IRREGULAR_VERB_TRANSLATION_VIEW } from "@/features/learning/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerIrregularVerbTranslation } from "@/features/learning/actions";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = Readonly<{
  currentView: LearningViewType;
  onAnswerChecked: (data: IrregularVerbAnswer) => void;
  expressionContextId: string;
}>;

const schema = z.object({
  form1: z.string().min(1, { message: "To pole jest wymagane" }),
  form2: z.string().min(1, { message: "To pole jest wymagane" }),
  form3: z.string().min(1, { message: "To pole jest wymagane" }),
});

type Inputs = z.infer<typeof schema>;

export function IrregularVerbTranslationView({
  currentView,
  onAnswerChecked,
  expressionContextId,
}: Props) {
  const { isPending, mutate } = useMutation({
    mutationFn: ({
      answer,
      expressionContextId,
    }: {
      answer: string[];
      expressionContextId: string;
    }) => checkAnswerIrregularVerbTranslation(answer, expressionContextId),

    onSuccess: (res) => {
      onAnswerChecked(res);
    },

    onError: () => {
      toast.error("Wystąpił niespodziewany błąd");
    },
  });

  const form = useForm<Inputs>({
    defaultValues: {
      form1: "",
      form2: "",
      form3: "",
    },
    resolver: zodResolver(schema),
  });

  const input1Ref = useRef<HTMLInputElement>(null);

  const handleCheckAnswer = (data: Inputs) => {
    const answer = [data.form1, data.form2, data.form3];
    mutate({ answer, expressionContextId });
    form.reset();
  };

  useEffect(() => {
    if (input1Ref.current) {
      input1Ref.current.focus();
    }
  });

  if (currentView !== IRREGULAR_VERB_TRANSLATION_VIEW) return null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCheckAnswer)}>
          <div className={"flex justify-center gap-4"}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I forma</FormLabel>
                  <Input {...field} autoComplete={"off"} ref={input1Ref} />
                  <FormMessage />
                </FormItem>
              )}
              name={"form1"}
              control={form.control}
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>II forma</FormLabel>
                  <Input {...field} autoComplete={"off"} />
                  <FormMessage />
                </FormItem>
              )}
              name={"form2"}
              control={form.control}
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>III forma</FormLabel>
                  <Input {...field} autoComplete={"off"} />
                  <FormMessage />
                </FormItem>
              )}
              name={"form3"}
              control={form.control}
            />
          </div>

          <div className={"flex items-center justify-end mt-8"}>
            <Button type={"submit"} disabled={isPending}>
              {isPending
                ? "Sprawdzam odpowiedź..."
                : "Sprawdź odpowiedź (ENTER)"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
