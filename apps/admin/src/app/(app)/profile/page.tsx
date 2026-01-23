import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ChangePasswordForm } from "@/features/admin-users/components/change-password-form";

export default async function ProfilePage() {
  return (
    <div>
      <h1 className={"text-2xl"}>Profil</h1>

      <div className={"w-6/12 mt-8"}>
        <Card>
          <CardHeader>
            <CardTitle>Resetowanie hasła</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
