import { Suspense } from "react";
import { getUsers } from "@/features/users/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { User } from "@/features/users/types";
import { Pagination } from "@/components/pagination";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { UsersTableItemActions } from "@/features/users/components/users-table-item-actions";
import { Badge } from "@repo/ui/components/ui/badge";
import { PageHeader } from "@/components/page-header";

const TAKE = 10;

type Props = Readonly<{
  searchParams: Promise<{
    page: string;
  }>;
}>;

export default async function UsersPage({ searchParams }: Props) {
  const searchParamsValues = await searchParams;
  return (
    <div>
      <PageHeader title="Lista użytkowników" />
      <Suspense
        fallback={
          <TableSkeletonLoader
            headers={["Email", "Imię i nazwisko", "Status", ""]}
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
  searchParamsValues: { page: string };
}>) {
  const page = searchParamsValues.page
    ? Number.parseInt(searchParamsValues.page)
    : 1;
  const usersData = await getUsers(page, TAKE);
  if (!usersData.data?.length)
    return (
      <div className={"mt-8"}>
        <NoDataPlaceholder
          heading="Brak użytkowników"
          description="Nie znaleziono żadnych użytkowników w bazie danych."
        />
      </div>
    );
  return (
    <div>
      <div className={"mt-4"}>
        <UsersListTable users={usersData.data} />
      </div>
      <div className={"flex justify-end mt-4"}>
        <Pagination
          currentPage={usersData.currentPage}
          total={usersData.total}
          take={TAKE}
          otherSearchParams={searchParamsValues}
        />
      </div>
    </div>
  );
}

function UsersListTable({ users }: Readonly<{ users: User[] }>) {
  return (
    <Table className={"w-full"}>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Imię i nazwisko</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.userId}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Badge variant={user.blocked ? "destructive" : "secondary"}>
                {user.blocked ? "Zablokowany" : "Aktywny"}
              </Badge>
            </TableCell>
            <TableCell className={"flex justify-end"}>
              <UsersTableItemActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
