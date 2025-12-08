import { Suspense } from "react";
import Link from "next/link";
import {
  getExpression,
  getExpressionContexts,
} from "@/features/dictionary/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { ExpressionContext } from "@/features/dictionary/types";
import { expressionTypeMap } from "@/features/dictionary/utils";
import { AddExpressionContextMenu } from "@/features/dictionary/components/add-expression-context-menu";
import { ExpressionContextsTableItemActions } from "@/features/dictionary/components/expression-contexts-table-item-actions";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { PageHeader } from "@/components/page-header";

const TAKE = 10;

type Props = {
  params: Promise<{ expressionId: string }>;
  searchParams: Promise<{ page: string }>;
};

export default async function ExpressionContextsPage({
  params,
  searchParams,
}: Props) {
  const { expressionId } = await params;
  const { page } = await searchParams;
  const expression = await getExpression(expressionId);
  return (
    <div>
      <PageHeader
        title={`${expression.phrase} - Lista kontekstów`}
        backLink={{ href: "/expressions" }}
      />
      <div className={"flex justify-end"}>
        <AddExpressionContextMenu expressionId={expressionId} />
      </div>
      <div className={"mt-4"}>
        <Suspense
          fallback={
            <TableSkeletonLoader
              headers={["Tłumaczenie", "Typ", ""]}
              showPagination={true}
            />
          }
        >
          <AwaitedContent expressionId={expressionId} page={page} />
        </Suspense>
      </div>
    </div>
  );
}

async function AwaitedContent({
  expressionId,
  page,
}: {
  expressionId: string;
  page: string;
}) {
  const expressionContextsData = await getExpressionContexts(
    expressionId,
    page ? parseInt(page) : 1,
    TAKE,
  );

  if (!expressionContextsData.data?.length)
    return (
      <NoDataPlaceholder
        heading="Brak kontekstów"
        description="Nie znaleziono żadnych kontekstów dla tego wyrażenia."
        description2="Konteksty będą dostępne po dodaniu tłumaczeń dla tego wyrażenia"
      />
    );

  return (
    <div>
      <ContextsListTable
        expressionContexts={expressionContextsData.data}
        expressionId={expressionId}
      />
      <div className={"flex justify-end mt-4"}>
        <Pagination
          currentPage={expressionContextsData.currentPage}
          total={expressionContextsData.total}
          take={TAKE}
        />
      </div>
    </div>
  );
}

function ContextsListTable({
  expressionContexts,
  expressionId,
}: {
  expressionContexts: ExpressionContext[];
  expressionId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tłumaczenie</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {expressionContexts.map((expressionContext) => (
          <TableRow key={expressionContext.expressionContextId}>
            <TableCell>
              <Link
                href={`/expressions/${expressionId}/context/${expressionContext.expressionContextId}`}
              >
                {expressionContext.translation}
              </Link>
            </TableCell>
            <TableCell>
              {expressionTypeMap.get(expressionContext.type)}
            </TableCell>
            <TableCell className={"flex justify-end"}>
              <ExpressionContextsTableItemActions
                expressionContext={expressionContext}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
