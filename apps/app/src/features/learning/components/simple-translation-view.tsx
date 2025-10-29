import { GeneralAnswer, LearningViewType } from "@/features/learning/types";
import { SIMPLE_TRANSLATION_VIEW } from "@/features/learning/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerSimpleTranslation } from "@/features/learning/actions";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";

type Props = {
  currentView: LearningViewType;
  onAnswerChecked: (data: GeneralAnswer) => void;
  expressionContextId: string;
};

type Inputs = {
  answer: string;
};

export function SimpleTranslationView({
  currentView,
  onAnswerChecked,
  expressionContextId,
}: Props) {
  const { isPending, mutate } = useMutation({
    mutationFn: ({
      answer,
      expressionContextId,
    }: {
      answer: string;
      expressionContextId: string;
    }) => checkAnswerSimpleTranslation(answer, expressionContextId),

    onSuccess: async (res) => {
      onAnswerChecked(res);
    },

    onError: () => {
      toast.error("Wystąpił niespodziewany błąd");
    },
  });

  const form = useForm<Inputs>({
    defaultValues: {
      answer: "",
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCheckAnswer = (data: Inputs) => {
    mutate({ answer: data.answer, expressionContextId });
    form.reset();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  if (currentView !== SIMPLE_TRANSLATION_VIEW) return null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCheckAnswer)}>
          <div className={"max-w-2/3 mx-auto"}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <Input
                    className={"text-center"}
                    {...field}
                    autoComplete={"off"}
                    ref={inputRef}
                  />
                </FormItem>
              )}
              name={"answer"}
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
