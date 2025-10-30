import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { getMe } from "@/features/auth/actions";
import { UserGoalWidget } from "@/features/gamification/components/user-goal-widget";

export async function Topbar() {
  const currentLoggedUser = await getMe();

  return (
    <div className={"px-8 py-2"}>
      <div className={"flex items-center justify-between gap-4"}>
        <UserGoalWidget />
        <UserDropdownMenu loggedUser={currentLoggedUser} />
      </div>
    </div>
  );
}
