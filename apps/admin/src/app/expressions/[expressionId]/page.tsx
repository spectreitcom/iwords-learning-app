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
      <div className={"mt-8"}>
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
    parseInt(page) ?? 1,
    TAKE,
  );

  if (!expressionContextsData.data?.length) return <NoData />;

  return (
    <div>
      <ContextsListTable expressionContexts={expressionContextsData.data} />
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
}: {
  expressionContexts: ExpressionContext[];
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
            <TableCell>{expressionContext.translation}</TableCell>
            <TableCell>
              {expressionTypeMap.get(expressionContext.type)}
            </TableCell>
            <TableCell />
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

function NoData() {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Brak kontekstów
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Nie znaleziono żadnych kontekstów dla tego wyrażenia.
        </p>
        <div className="text-xs text-gray-400">
          Konteksty będą dostępne po dodaniu tłumaczeń dla tego wyrażenia
        </div>
      </CardContent>
    </Card>
  );
}
