import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBoxesNumber } from "@/features/boxes/actions";
import { Boxes as BoxesIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export async function BoxesNumberWidget() {
  const { boxesNumber } = await getBoxesNumber();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Boxes</CardTitle>
        <BoxesIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums">{boxesNumber}</div>
        <CardDescription>Total boxes</CardDescription>
      </CardContent>
    </Card>
  );
}

export function BoxesNumberSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Boxes</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
        <div className="mt-1 text-muted-foreground text-sm">
          Loading total boxes…
        </div>
      </CardContent>
    </Card>
  );
}
