import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOnlyTranslationExpressionContextData,
  createOnlyTranslationExpressionContextSchema,
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
import { Button } from "@/components/ui/button";

type Props = {
  expressionId: string;
  onSubmitted: (data: CreateOnlyTranslationExpressionContextData) => void;
};

export function CreateOnlyTranslationExpressionContextForm({
  expressionId,
  onSubmitted,
}: Props) {
  const form = useForm({
    resolver: zodResolver(createOnlyTranslationExpressionContextSchema),
    defaultValues: {
      translation: "",
      expressionId,
    },
  });

  const submit = async (data: CreateOnlyTranslationExpressionContextData) => {
    onSubmitted(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={"space-y-4"}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tłumaczenie</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"translation"}
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
