import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { getUsersNumber } from "@/features/users/actions";
import { Users as UsersIcon } from "lucide-react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

export async function UsersNumberWidget() {
  const { usersNumber } = await getUsersNumber();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Users</CardTitle>
        <UsersIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums">{usersNumber}</div>
        <CardDescription>Total registered users</CardDescription>
      </CardContent>
    </Card>
  );
}

export function UsersNumberSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
        <div className="mt-1 text-muted-foreground text-sm">
          Loading total users…
        </div>
      </CardContent>
    </Card>
  );
}
