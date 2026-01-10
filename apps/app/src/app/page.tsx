import { LastSevenDaysGoalsProgressWidget } from "@/features/gamification/components/last-seven-days-goals-progress-widget";
import { BoxRepetitionsWidget } from "@/features/box-repetition/components/box-repetitions-widget";

export default async function Home() {
  return (
    <div className=" px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
        Dashboard
      </h1>

      <div className="grid gap-6">
        <section className={"max-w-5xl"}>
          <LastSevenDaysGoalsProgressWidget />
        </section>

        <section className={"max-w-5xl"}>
          <BoxRepetitionsWidget />
        </section>
      </div>
    </div>
  );
}
