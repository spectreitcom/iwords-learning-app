import {
  CreateSentenceData,
  createSentenceSchema,
} from "@/features/dictionary/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  onSubmitted: (data: CreateSentenceData) => void;
  defaultValues?: CreateSentenceData;
};

export function CreateSentenceForm({ defaultValues, onSubmitted }: Props) {
  const form = useForm<CreateSentenceData>({
    resolver: zodResolver(createSentenceSchema),
    defaultValues: {
      content: defaultValues?.content ?? "",
      translation: defaultValues?.translation ?? "",
    },
  });

  const submit = async (data: CreateSentenceData) => {
    onSubmitted(data);
  };

  return (
    <Form {...form}>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zdanie</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"content"}
          control={form.control}
        />

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
