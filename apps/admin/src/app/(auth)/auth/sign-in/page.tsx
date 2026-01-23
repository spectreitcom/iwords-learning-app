import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { AuthLoginForm } from "@/features/auth/components/auth-login-form";

export default function SignInPage() {
  return (
    <div>
      <Card className={"w-96"}>
        <CardHeader>
          <CardTitle>iWords Admin</CardTitle>
          <CardDescription>
            Wprowadź email i hasło aby się zalogować
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
