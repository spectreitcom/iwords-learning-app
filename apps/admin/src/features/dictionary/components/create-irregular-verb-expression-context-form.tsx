import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateIrregularVerbExpressionContextData,
  createIrregularVerbExpressionContextSchema,
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
  onSubmitted: (data: CreateIrregularVerbExpressionContextData) => void;
};

export function CreateIrregularVerbExpressionContextForm({
  expressionId,
  onSubmitted,
}: Props) {
  const form = useForm({
    resolver: zodResolver(createIrregularVerbExpressionContextSchema),
    defaultValues: {
      translation: "",
      expressionId,
      form1: "",
      form2: "",
      form3: "",
    },
  });

  const submit = async (data: CreateIrregularVerbExpressionContextData) => {
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

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma I</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"form1"}
          control={form.control}
        />

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma II</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"form2"}
          control={form.control}
        />

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma III</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"form3"}
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
