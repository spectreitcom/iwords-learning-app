import { GeneralAnswer, LearningViewType } from "@/features/learning/types";
import { SENTENCE_TRANSLATION_VIEW } from "@/features/learning/constants";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerSentenceTranslation } from "@/features/learning/actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = Readonly<{
  currentView: LearningViewType;
  onAnswerChecked: (data: GeneralAnswer) => void;
  sentenceId: string;
}>;

const schema = z.object({
  answer: z.string().min(1, { message: "To pole jest wymagane" }),
});

type Inputs = z.infer<typeof schema>;

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
    resolver: zodResolver(schema),
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
    <div className="max-w-3xl mx-auto px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCheckAnswer)}
          className="glass rounded-2xl p-6 md:p-8 shadow-md"
        >
          <div className={"max-w-2xl mx-auto"}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    {...field}
                    ref={inputRef}
                    autoComplete={"off"}
                    className="min-h-28 md:min-h-36 text-base md:text-lg rounded-xl"
                  />
                  <FormMessage />
                </FormItem>
              )}
              name={"answer"}
              control={form.control}
            />
          </div>

          <div className={"flex items-center justify-end mt-6 md:mt-8"}>
            <Button
              type={"submit"}
              disabled={isPending}
              size="lg"
              className="shadow-md"
            >
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
