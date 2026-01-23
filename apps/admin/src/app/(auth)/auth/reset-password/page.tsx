import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { RequestForResetPasswordForm } from "@/features/admin-users/components/request-for-reset-password-form";
import { ResetPasswordForm } from "@/features/admin-users/components/reset-password-form";

type Props = Readonly<{
  searchParams: Promise<Readonly<{ token: string }>>;
}>;

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <div>
      <Card className={"max-w-96 w-96"}>
        <CardHeader>
          <CardTitle>iWords Admin</CardTitle>
          <CardDescription>
            Wprowadź email aby z resetować hasło
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <RequestForResetPasswordForm />
          ) : (
            <ResetPasswordForm token={token} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
