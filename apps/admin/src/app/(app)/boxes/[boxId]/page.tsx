import { Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { getBoxDetails } from "@/features/boxes/actions";
import { BoxDetails, BoxItem } from "@/features/boxes/types";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { AddItemToBoxModal } from "@/features/boxes/components/add-item-to-box-modal";
import { RemoveBoxItemButton } from "@/features/boxes/components/remove-box-item-button";
import { PageHeader } from "@/components/page-header";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@repo/ui/components/ui/badge";

type Props = Readonly<{
  params: Promise<Readonly<{ boxId: string }>>;
}>;

export default async function BoxDetailPage({ params }: Props) {
  const { boxId } = await params;
  const boxDetails = await getBoxDetails(boxId);
  const itemsCount = boxDetails.boxItems?.length ?? 0;
  const maxItems = 5;
  const isOverLimit = itemsCount > maxItems;

  return (
    <div>
      <PageHeader
        title={`Box - ${boxDetails.title}`}
        backLink={{ href: "/boxes" }}
      />
      <div className={"mt-4"}>
        <Alert variant={isOverLimit ? "destructive" : "default"}>
          {isOverLimit ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertTitle className="flex items-center gap-2">
            Limit elementów w pudełku
            <Badge variant={isOverLimit ? "destructive" : "secondary"}>
              {itemsCount} / {maxItems}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            {isOverLimit
              ? `Przekroczono maksymalny limit ${maxItems} elementów. Usuń ${itemsCount - maxItems} ${itemsCount - maxItems === 1 ? "element" : "elementy"}, aby kontynuować.`
              : `Możesz dodać jeszcze ${maxItems - itemsCount} ${maxItems - itemsCount === 1 ? "element" : "elementów"} do tego pudełka.`}
          </AlertDescription>
        </Alert>
      </div>
      <div className={"flex justify-end mt-4"}>
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

async function AwaitedContent({
  boxDetails,
}: Readonly<{ boxDetails: BoxDetails }>) {
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
      <BoxItemsTable boxItems={boxDetails.boxItems} boxId={boxDetails.boxId} />
    </div>
  );
}

function BoxItemsTable({
  boxItems,
  boxId,
}: Readonly<{
  boxItems: BoxItem[];
  boxId: string;
}>) {
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
              <RemoveBoxItemButton
                boxId={boxId}
                expressionContextId={boxItem.expressionContextId}
                phrase={boxItem.phrase}
                translation={boxItem.translation}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
