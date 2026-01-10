"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordData,
  resetPasswordSchema,
} from "@/features/admin-users/schemas";
import {
  resetPassword,
  validateResetPasswordToken,
} from "@/features/admin-users/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormMsg = {
  type: "default" | "destructive";
  message: string;
};

type Props = Readonly<{
  token: string;
}>;

export function ResetPasswordForm({ token }: Props) {
  const [validatingToken, setValidatingToken] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMsg | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const submit = async (data: ResetPasswordData) => {
    setResettingPassword(true);
    const response = await resetPassword(token, data.password);
    if (response?.error) {
      setFormMessage({
        type: "destructive",
        message: "Wrong or expired token",
      });
    }
    setResettingPassword(false);
  };

  useEffect(() => {
    validateResetPasswordToken(token)
      .then((res) => {
        if (!res.valid) {
          setFormMessage({
            type: "destructive",
            message: "Wrong or expired token",
          });
        }
      })
      .finally(() => setValidatingToken(false));
  }, [token]);

  if (validatingToken)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={"space-y-4"}>
        {formMessage && (
          <Alert variant={formMessage.type}>
            <AlertDescription>{formMessage.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <Input {...field} type={"password"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"password"}
          control={form.control}
        />

        <div className={"flex justify-end"}>
          <Button
            type={"submit"}
            disabled={
              form.formState.isSubmitting ||
              resettingPassword ||
              validatingToken
            }
          >
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
