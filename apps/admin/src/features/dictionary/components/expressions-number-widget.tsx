import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getExpressionsNumber } from "@/features/dictionary/actions";
import { Quote as ExpressionsIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export async function ExpressionsNumberWidget() {
  const { expressionsNumber } = await getExpressionsNumber();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Expressions</CardTitle>
        <ExpressionsIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums">
          {expressionsNumber.toLocaleString()}
        </div>
        <CardDescription>Total dictionary expressions</CardDescription>
      </CardContent>
    </Card>
  );
}

export function ExpressionsNumberSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Expressions</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
        <div className="mt-1 text-muted-foreground text-sm">
          Loading total expressions…
        </div>
      </CardContent>
    </Card>
  );
}
