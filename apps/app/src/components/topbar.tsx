import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { getMe } from "@/features/auth/actions";
import { UserGoalWidget } from "@/features/gamification/components/user-goal-widget";
import { ModeToggle } from "@/components/mode-toggle";

export async function Topbar() {
  const currentLoggedUser = await getMe();

  return (
    <div className={"px-8 py-2"}>
      <div className={"flex items-center justify-between gap-4"}>
        <UserGoalWidget />
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserDropdownMenu loggedUser={currentLoggedUser} />
        </div>
      </div>
    </div>
  );
}
