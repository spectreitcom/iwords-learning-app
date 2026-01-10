import { Suspense } from "react";
import { getAdminUsers } from "@/features/admin-users/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminUser } from "@/features/admin-users/types";
import { Pagination } from "@/components/pagination";
import { InviteAdminUserModal } from "@/features/admin-users/components/invite-admin-user-modal";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { AdminUsersTableItemActions } from "@/features/admin-users/components/admin-users-table-item-actions";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

const TAKE = 10;

type Props = {
  searchParams: Promise<
    Readonly<{
      page: string;
    }>
  >;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const searchParamsValues = await searchParams;
  return (
    <div>
      <PageHeader title="Lista administratorów" />
      <div className={"flex justify-end"}>
        <InviteAdminUserModal />
      </div>
      <div className={"mt-4"}>
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
    </div>
  );
}

async function AwaitedContent({
  searchParamsValues,
}: {
  searchParamsValues: Readonly<{ page: string }>;
}) {
  const page = searchParamsValues.page
    ? Number.parseInt(searchParamsValues.page)
    : 1;
  const adminUsersData = await getAdminUsers(page, TAKE);
  if (!adminUsersData.data?.length)
    return (
      <div className={"mt-8"}>
        <NoDataPlaceholder
          heading="Brak administratorów"
          description="Nie znaleziono żadnych administratorów w bazie danych."
          description2="Spróbuj dodać nowych administratorów"
        />
      </div>
    );
  return (
    <div>
      <div className={"mt-4"}>
        <AdminUsersListTable adminUsers={adminUsersData.data} />
      </div>
      <div className={"flex justify-end mt-4"}>
        <Pagination
          currentPage={adminUsersData.currentPage}
          total={adminUsersData.total}
          take={TAKE}
          otherSearchParams={searchParamsValues}
        />
      </div>
    </div>
  );
}

function AdminUsersListTable({
  adminUsers,
}: Readonly<{ adminUsers: AdminUser[] }>) {
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
        {adminUsers.map((adminUser) => (
          <TableRow key={adminUser.adminUserId}>
            <TableCell>{adminUser.email}</TableCell>
            <TableCell>{adminUser.name}</TableCell>
            <TableCell>
              <Badge variant={adminUser.blocked ? "destructive" : "secondary"}>
                {adminUser.blocked ? "Zablokowany" : "Aktywny"}
              </Badge>
            </TableCell>
            <TableCell className={"flex justify-end"}>
              <AdminUsersTableItemActions adminUser={adminUser} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
