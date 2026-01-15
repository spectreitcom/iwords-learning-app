import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateExpressionData,
  createExpressionSchema,
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
import { Alert, AlertTitle } from "@/components/ui/alert";

type Props = Readonly<{
  onSubmitted: (data: CreateExpressionData) => void;
  showInfoPanel?: boolean;
  defaultValues?: CreateExpressionData;
  pending?: boolean;
}>;

export function CreateExpressionForm({
  onSubmitted,
  showInfoPanel,
  defaultValues,
  pending,
}: Props) {
  const form = useForm({
    resolver: zodResolver(createExpressionSchema),
    defaultValues: {
      phrase: defaultValues?.phrase ?? "",
    },
  });

  const submit = async (data: CreateExpressionData) => {
    onSubmitted(data);
  };

  return (
    <Form {...form}>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
        {showInfoPanel && <InfoPanel phrase={form.getValues().phrase} />}

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fraza</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"phrase"}
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

function InfoPanel({ phrase }: Readonly<{ phrase: string }>) {
  return (
    <Alert variant={"destructive"}>
      <AlertTitle>Wyrażenie {phrase} już istnieje w bazie danych.</AlertTitle>
    </Alert>
  );
}
