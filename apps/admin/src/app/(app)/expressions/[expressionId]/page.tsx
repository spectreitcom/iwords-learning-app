import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ExpressionContext } from "@/features/dictionary/types";
import { expressionTypeMap } from "@/features/dictionary/utils";
import { AddExpressionContextMenu } from "@/features/dictionary/components/add-expression-context-menu";
import { ExpressionContextsTableItemActions } from "@/features/dictionary/components/expression-contexts-table-item-actions";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";

const TAKE = 20;

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
      <div>
        <Link href={"/expressions"} className={"flex items-center gap-2"}>
          <ChevronLeftIcon />
          Powrót
        </Link>
        <h1 className={"text-2xl mt-2"}>
          {expression.phrase} - Lista kontekstów
        </h1>
      </div>
      <div className={"mt-8 flex justify-end"}>
        <AddExpressionContextMenu expressionId={expressionId} />
      </div>
      <div className={"mt-4"}>
        <Suspense fallback={<SkeletonLoader />}>
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

  if (!expressionContextsData.data?.length) return (
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

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Tłumaczenie</TableHead>
            <TableHead>Typ</TableHead>
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
      <div className="flex justify-end mt-6">
        <div className="flex items-center space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gray-200 animate-pulse rounded"
              style={{
                background:
                  "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

