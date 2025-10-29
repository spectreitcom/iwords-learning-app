import { GeneralAnswer, LearningViewType } from "@/features/learning/types";
import { SENTENCE_TRANSLATION_VIEW } from "@/features/learning/constants";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerSentenceTranslation } from "@/features/learning/actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  currentView: LearningViewType;
  onAnswerChecked: (data: GeneralAnswer) => void;
  sentenceId: string;
};

type Inputs = { answer: string };

export function SentenceTranslationView({
  currentView,
  onAnswerChecked,
  sentenceId,
}: Props) {
  const { isPending, mutate } = useMutation({
    mutationFn: ({
      answer,
      sentenceId,
    }: {
      answer: string;
      sentenceId: string;
    }) => checkAnswerSentenceTranslation(answer, sentenceId),

    onSuccess: (res) => {
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

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleCheckAnswer = (data: Inputs) => {
    mutate({ answer: data.answer, sentenceId });
    form.reset();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  if (currentView !== SENTENCE_TRANSLATION_VIEW) return null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCheckAnswer)}>
          <div className={"max-w-2/3 mx-auto"}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <Textarea {...field} ref={inputRef} autoComplete={"off"} />
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
