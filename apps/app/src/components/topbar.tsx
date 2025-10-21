import { UserDropdownMenu } from "@/components/user-dropdown-menu";

export function Topbar() {
  return (
    <div className={"px-8 py-2"}>
      <div className={"flex items-center justify-end"}>
        <UserDropdownMenu />
      </div>
    </div>
  );
}
