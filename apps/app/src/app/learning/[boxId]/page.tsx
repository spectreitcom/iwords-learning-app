import { Spinner } from "@repo/ui/components/ui/spinner";
import { Suspense } from "react";
import { getBoxDetails } from "@/features/boxes/actions";
import { LearningMain } from "@/features/learning/components/learning-main";
import _ from "lodash";

type Props = Readonly<{
  params: Promise<{ boxId: string }>;
}>;

export default async function LearningPage({ params }: Props) {
  const { boxId } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent boxId={boxId} />
    </Suspense>
  );
}

async function AwaitedContent({ boxId }: Readonly<{ boxId: string }>) {
  const boxDetails = await getBoxDetails(boxId);
  const items = _.shuffle(boxDetails.items);
  return (
    <LearningMain
      boxItems={items}
      title={boxDetails.title}
      boxId={boxDetails.boxId}
    />
  );
}

function Loader() {
  return <Spinner className={"w-8 h-8"} />;
}
