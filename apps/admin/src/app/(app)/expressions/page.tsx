import { Suspense } from "react";
import { getExpressions } from "@/features/dictionary/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Expression } from "@/features/dictionary/types";
import { Pagination } from "@/components/pagination";
import { SearchExpressionsInput } from "@/features/dictionary/components/search-expressions-input";
import { ExpressionTableItemActions } from "@/features/dictionary/components/expression-table-item-actions";
import { AddExpressionModal } from "@/features/dictionary/components/add-expression-modal";
import Link from "next/link";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { PageHeader } from "@/components/page-header";

const TAKE = 10;

type Props = Readonly<{
  searchParams: Promise<{
    page: string;
    searchText: string;
  }>;
}>;

export default async function ExpressionsPage({ searchParams }: Props) {
  const searchParamsValues = await searchParams;
  return (
    <div>
      <PageHeader title="Lista wyrażeń" />
      <div className={"flex justify-end"}>
        <AddExpressionModal />
      </div>
      <div className={"mt-4"}>
        <SearchExpressionsInput
          searchText={searchParamsValues.searchText ?? ""}
          otherSearchParams={searchParamsValues}
        />
      </div>
      <Suspense
        fallback={
          <TableSkeletonLoader
            headers={["Wyrażenie", ""]}
            showPagination={true}
          />
        }
      >
        <AwaitedContent searchParamsValues={searchParamsValues} />
      </Suspense>
    </div>
  );
}

async function AwaitedContent({
  searchParamsValues,
}: Readonly<{
  searchParamsValues: { page: string; searchText: string };
}>) {
  const page = searchParamsValues.page
    ? Number.parseInt(searchParamsValues.page)
    : 1;
  const searchText = searchParamsValues.searchText || "";
  const expressionsData = await getExpressions(page, searchText, TAKE);
  if (!expressionsData.data?.length)
    return (
      <div className={"mt-8"}>
        <NoDataPlaceholder
          heading="Brak wyrażeń"
          description="Nie znaleziono żadnych wyrażeń w bazie danych."
          description2="Spróbuj dodać nowe wyrażenia lub zmienić kryteria wyszukiwania"
        />
      </div>
    );
  return (
    <div>
      <div className={"mt-4"}>
        <ExpressionsListTable expressions={expressionsData.data} />
      </div>
      <div className={"flex justify-end mt-4"}>
        <Pagination
          currentPage={expressionsData.currentPage}
          total={expressionsData.total}
          take={TAKE}
          otherSearchParams={searchParamsValues}
        />
      </div>
    </div>
  );
}

function ExpressionsListTable({
  expressions,
}: Readonly<{ expressions: Expression[] }>) {
  return (
    <Table className={"w-full"}>
      <TableHeader>
        <TableRow>
          <TableHead>Wyrażenie</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {expressions.map((expression) => (
          <TableRow key={expression.expressionId}>
            <TableCell>
              <Link href={`/expressions/${expression.expressionId}`}>
                {expression.phrase}
              </Link>
            </TableCell>
            <TableCell className={"flex justify-end"}>
              <ExpressionTableItemActions expression={expression} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
