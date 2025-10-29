import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { getBoxDetails } from "@/features/boxes/actions";
import { LearningMain } from "@/features/learning/components/learning-main";

type Props = {
  params: Promise<{ boxId: string }>;
};

export default async function LearningPage({ params }: Props) {
  const { boxId } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent boxId={boxId} />
    </Suspense>
  );
}

async function AwaitedContent({ boxId }: { boxId: string }) {
  const boxDetails = await getBoxDetails(boxId);
  return (
    <LearningMain
      boxItems={boxDetails.items}
      boxTitle={boxDetails.title}
      boxId={boxDetails.boxId}
    />
  );
}

function Loader() {
  return <Spinner className={"w-8 h-8"} />;
}
