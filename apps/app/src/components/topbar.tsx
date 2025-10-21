import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { getMe } from "@/features/auth/actions";

export async function Topbar() {
  const currentLoggedUser = await getMe();

  return (
    <div className={"px-8 py-2"}>
      <div className={"flex items-center justify-end"}>
        <UserDropdownMenu loggedUser={currentLoggedUser} />
      </div>
    </div>
  );
}
