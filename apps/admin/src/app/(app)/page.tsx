import { Suspense } from "react";
import {
  UsersNumberSkeleton,
  UsersNumberWidget,
} from "@/features/users/components/users-number-widget";
import {
  ExpressionsNumberSkeleton,
  ExpressionsNumberWidget,
} from "@/features/dictionary/components/expressions-number-widget";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your application
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<UsersNumberSkeleton />}>
          <UsersNumberWidget />
        </Suspense>
        <Suspense fallback={<ExpressionsNumberSkeleton />}>
          <ExpressionsNumberWidget />
        </Suspense>
      </div>
    </div>
  );
}
