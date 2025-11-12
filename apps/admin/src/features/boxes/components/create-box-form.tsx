import { CreateBoxData, createBoxSchema } from "@/features/boxes/schemas";
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
  onSubmitted: (data: CreateBoxData) => void;
  defaultValues?: CreateBoxData;
  pending?: boolean;
};

export function CreateBoxForm({ onSubmitted, defaultValues, pending }: Props) {
  const form = useForm<CreateBoxData>({
    resolver: zodResolver(createBoxSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
    },
  });

  const submit = async (data: CreateBoxData) => {
    onSubmitted(data);
  };

  return (
    <Form {...form}>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"title"}
          control={form.control}
        />

        <div className={"flex justify-end"}>
          <Button
            type={"submit"}
            disabled={form.formState.isSubmitting || pending}
          >
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}
