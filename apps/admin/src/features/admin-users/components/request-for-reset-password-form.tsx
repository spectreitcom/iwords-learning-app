"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RequestForResetPasswordData,
  requestForResetPasswordSchema,
} from "@/features/admin-users/schemas";
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
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requestForResetPassword } from "@/features/admin-users/actions";

type FormMsg = {
  message: string;
};

export function RequestForResetPasswordForm() {
  const [formMessage, setFormMessage] = useState<FormMsg | null>(null);

  const form = useForm({
    resolver: zodResolver(requestForResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const submit = async (data: RequestForResetPasswordData) => {
    await requestForResetPassword(data.email);
    setFormMessage({
      message: "Na podany adres email został wysłany link do resetu hasła",
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={"space-y-4"}>
        {formMessage && (
          <Alert variant="default">
            <AlertTitle>Wiadomość została wysłana</AlertTitle>
            <AlertDescription>{formMessage.message}</AlertDescription>
          </Alert>
        )}

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

        <div className={"flex justify-end"}>
          <Button type={"submit"} loading={form.formState.isSubmitting}>
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}
