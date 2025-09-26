import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateNounExpressionContextData,
  createNounExpressionContextSchema,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useId } from "react";
import { Label } from "@/components/ui/label";

type Props = {
  expressionId: string;
  onSubmitted: (data: CreateNounExpressionContextData) => void;
};

export function CreateNounExpressionContextForm({
  expressionId,
  onSubmitted,
}: Props) {
  const form = useForm({
    resolver: zodResolver(createNounExpressionContextSchema),
    defaultValues: {
      translation: "",
      expressionId,
      isCountable: false,
    },
  });

  const checkboxId = useId();

  const submit = async (data: CreateNounExpressionContextData) => {
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
              <FormControl>
                <div className={"flex"}>
                  <Checkbox
                    id={checkboxId}
                    className={"mr-2"}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                  <Label htmlFor={checkboxId}>Czy jest policzalny</Label>
                </div>
              </FormControl>
            </FormItem>
          )}
          name={"isCountable"}
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
