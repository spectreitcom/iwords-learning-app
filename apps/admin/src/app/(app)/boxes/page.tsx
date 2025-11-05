import { Suspense } from "react";
import { getBoxes } from "@/features/boxes/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box } from "@/features/boxes/types";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { CreateBoxModal } from "@/features/boxes/components/create-box-modal";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { BoxesTableItemActions } from "@/features/boxes/components/boxes-table-item-actions";

const TAKE = 10;

type Props = {
  searchParams: Promise<{
    page: string;
  }>;
};

export default async function BoxesPage({ searchParams }: Props) {
  const searchParamsValues = await searchParams;
  return (
    <div>
      <h1 className={"text-2xl"}>Lista boxów</h1>
      <div className={"mt-8"}>
        <div className={"mt-4 flex justify-end"}>
          <CreateBoxModal />
        </div>
        <Suspense
          fallback={
            <TableSkeletonLoader
              headers={["Tytuł", "Liczba kontekstów", ""]}
              showPagination={true}
            />
          }
        >
          <AwaitedContent searchParamsValues={searchParamsValues} />
        </Suspense>
      </div>
    </div>
  );
}

async function AwaitedContent({
  searchParamsValues,
}: {
  searchParamsValues: { page: string };
}) {
  const page = searchParamsValues.page ? parseInt(searchParamsValues.page) : 1;
  const boxesData = await getBoxes(page, TAKE);
  if (!boxesData.data?.length)
    return (
      <div className={"mt-8"}>
        <NoDataPlaceholder
          heading="Brak boxów"
          description="Nie znaleziono żadnych boxów w bazie danych."
          description2="Spróbuj dodać nowe boxy"
        />
      </div>
    );
  return (
    <div>
      <div className={"mt-4"}>
        <BoxesListTable boxes={boxesData.data} />
      </div>
      <div className={"flex justify-end mt-4"}>
        <Pagination
          currentPage={boxesData.currentPage}
          total={boxesData.total}
          take={TAKE}
          otherSearchParams={searchParamsValues}
        />
      </div>
    </div>
  );
}

function BoxesListTable({ boxes }: { boxes: Box[] }) {
  return (
    <Table className={"w-full"}>
      <TableHeader>
        <TableRow>
          <TableHead>Tytuł</TableHead>
          <TableHead>Liczba kontekstów</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {boxes.map((box) => (
          <TableRow key={box.boxId}>
            <TableCell>
              <Link href={`/boxes/${box.boxId}`}>{box.title}</Link>
            </TableCell>
            <TableCell>{box.expressionContextIds.length}</TableCell>
            <TableCell className={"flex justify-end"}>
              <BoxesTableItemActions box={box} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
