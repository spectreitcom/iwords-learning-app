import { Suspense } from "react";
import { getRepetitions } from "@/features/repetitions/actions";
import { LearningMain } from "@/features/learning/components/learning-main";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";

export default async function RepetitionsLearningPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent />
    </Suspense>
  );
}

async function AwaitedContent() {
  const repetitions = await getRepetitions();

  if (!repetitions?.length) {
    redirect("/repetitions");
  }

  return (
    <LearningMain
      repetitionMode
      boxItems={repetitions?.map((r) => r.expressionContext) ?? []}
      title={"Powtórki"}
    />
  );
}

function Loader() {
  return <Spinner className={"w-8 h-8"} />;
}
