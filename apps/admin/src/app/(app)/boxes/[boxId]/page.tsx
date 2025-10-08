import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBoxDetails } from "@/features/boxes/actions";
import { BoxDetails, BoxItem } from "@/features/boxes/types";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { AddItemToBoxModal } from "@/features/boxes/components/add-item-to-box-modal";

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
        <h1 className={"text-2xl mt-2"}>Box - {boxDetails.title}</h1>
      </div>
      <div className={"mt-8 flex justify-end"}>
        <AddItemToBoxModal
          boxId={boxDetails.boxId}
          chosenExpressionContextIds={
            boxDetails.boxItems?.map((item) => item.expressionContextId) ?? []
          }
        />
      </div>
      <div className={"mt-4"}>
        <Suspense
          fallback={
            <TableSkeletonLoader
              headers={["Wyrażenie", "Tłumaczenie", ""]}
              showPagination={false}
            />
          }
        >
          <AwaitedContent boxDetails={boxDetails} />
        </Suspense>
      </div>
    </div>
  );
}

async function AwaitedContent({ boxDetails }: { boxDetails: BoxDetails }) {
  if (!boxDetails.boxItems?.length)
    return (
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
