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
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";
import { CreateBoxModal } from "@/features/boxes/components/create-box-modal";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";

const TAKE = 20;

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
        <Suspense fallback={<SkeletonLoader />}>
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

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Tytuł</TableHead>
            <TableHead>Liczba kontekstów</TableHead>
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
                  className="w-8 h-4 bg-gray-200 animate-pulse rounded"
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
              {/* Actions can be added here similar to ExpressionTableItemActions */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

