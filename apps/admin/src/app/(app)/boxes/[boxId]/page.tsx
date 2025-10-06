import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeftIcon, FileTextIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getBoxDetails } from "@/features/boxes/actions";
import { BoxItem } from "@/features/boxes/types";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";

type Props = {
  params: Promise<{ boxId: string }>;
};

export default async function BoxDetailPage({ params }: Props) {
  const { boxId } = await params;
  const boxDetails = await getBoxDetails(boxId);

  return (
    <div>
      <div>
        <Link href={"/boxes"} className={"flex items-center gap-2"}>
          <ChevronLeftIcon />
          Powrót
        </Link>
        <h1 className={"text-2xl mt-2"}>
          {boxDetails.title} - Szczegóły pudełka
        </h1>
      </div>
      <div className={"mt-4"}>
        <Suspense fallback={<SkeletonLoader />}>
          <AwaitedContent boxDetails={boxDetails} />
        </Suspense>
      </div>
    </div>
  );
}

async function AwaitedContent({
  boxDetails,
}: {
  boxDetails: { boxId: string; title: string; boxItems: BoxItem[] };
}) {
  if (!boxDetails.boxItems?.length) return (
    <NoDataPlaceholder 
      heading="Brak elementów"
      description="To pudełko nie zawiera żadnych wyrażeń."
      description2="Dodaj wyrażenia do tego pudełka"
    />
  );

  return (
    <div>
      <BoxItemsTable boxItems={boxDetails.boxItems} />
    </div>
  );
}

function BoxItemsTable({ boxItems }: { boxItems: BoxItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wyrażenie</TableHead>
          <TableHead>Tłumaczenie</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {boxItems.map((boxItem) => (
          <TableRow key={boxItem.expressionContextId}>
            <TableCell>{boxItem.phrase}</TableCell>
            <TableCell>{boxItem.translation}</TableCell>
            <TableCell className={"flex justify-end"}>
              {/* Placeholder for future actions */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Wyrażenie</TableHead>
            <TableHead>Tłumaczenie</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <TableRow key={i} className="border-b">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div
                    className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"
                    style={{
                      background:
                        "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="h-4 w-16 bg-gray-200 animate-pulse rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              </TableCell>
              <TableCell>
                <div
                  className="w-8 h-4 bg-gray-200 animate-pulse rounded ml-auto"
                  style={{
                    background:
                      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

