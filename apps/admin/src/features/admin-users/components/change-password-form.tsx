"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordData,
  changePasswordSchema,
} from "@/features/admin-users/schemas";
import { changePassword } from "@/features/admin-users/actions";
import { toast } from "sonner";
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

export function ChangePasswordForm() {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      existingPassword: "",
      newPassword: "",
    },
  });

  const submit = async (data: ChangePasswordData) => {
    const response = await changePassword(data);
    if (response?.error) {
      toast.error(response.message);
      form.reset();
      return;
    }
    toast.success("Hasło zostało zmienione");
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={"space-y-4"}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bierzące hasło</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"existingPassword"}
          control={form.control}
        />

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"newPassword"}
          control={form.control}
        />

        <div className={"flex justify-end"}>
          <Button type={"submit"} loading={form.formState.isSubmitting}>
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}
