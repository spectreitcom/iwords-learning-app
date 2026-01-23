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
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

type Props = Readonly<{
  onSubmitted: (data: CreateOnlyTranslationExpressionContextData) => void;
  defaultValues?: CreateOnlyTranslationExpressionContextData;
  pending?: boolean;
}>;

export function CreateOnlyTranslationExpressionContextForm({
  onSubmitted,
  defaultValues,
  pending,
}: Props) {
  const form = useForm({
    resolver: zodResolver(createOnlyTranslationExpressionContextSchema),
    defaultValues: {
      translation: defaultValues?.translation ?? "",
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
          <Button
            type={"submit"}
            loading={form.formState.isSubmitting || pending}
          >
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}
