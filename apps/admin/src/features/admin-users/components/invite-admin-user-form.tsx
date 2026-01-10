import {
  InviteAdminUserData,
  inviteAdminUserSchema,
} from "@/features/admin-users/schemas";
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

type Props = Readonly<{
  onSubmitted: (data: InviteAdminUserData) => void;
  defaultValues?: InviteAdminUserData;
}>;

export function InviteAdminUserForm({ onSubmitted, defaultValues }: Props) {
  const form = useForm<InviteAdminUserData>({
    resolver: zodResolver(inviteAdminUserSchema),
    defaultValues: {
      email: defaultValues?.email ?? "",
      name: defaultValues?.name ?? "",
    },
  });

  const submit = async (data: InviteAdminUserData) => {
    onSubmitted(data);
  };

  return (
    <Form {...form}>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"email"}
          control={form.control}
        />

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię i nazwisko</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"name"}
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
