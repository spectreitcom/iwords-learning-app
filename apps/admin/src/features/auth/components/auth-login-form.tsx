"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { loginSchema, LoginSchema } from "@/features/auth/schemas";
import { login } from "@/features/auth/actions";
import { useState } from "react";
import { Alert, AlertTitle } from "@repo/ui/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

export function AuthLoginForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async (data: LoginSchema) => {
    setError(null);
    const result = await login(data);
    if (result.error) {
      setError("Invalid email or password");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={"space-y-4"}>
        {error && (
          <Alert variant={"destructive"}>
            <AlertCircleIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          name={"password"}
          control={form.control}
        />

        <div className={"flex justify-end"}>
          <Link href={"/auth/reset-password"}>Nie pamiętam hasła</Link>
        </div>

        <Button
          type={"submit"}
          className={"w-full"}
          loading={form.formState.isSubmitting}
        >
          Zaloguj
        </Button>
      </form>
    </Form>
  );
}
