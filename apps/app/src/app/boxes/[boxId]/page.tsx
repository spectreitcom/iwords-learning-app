import { Suspense } from "react";
import { getBoxDetails } from "@/features/boxes/actions";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Search } from "lucide-react";
import { StartLearningButton } from "@/features/learning/components/start-learning-button";
import { CopyBoxToClipboardButton } from "@/features/boxes/components/copy-box-to-clipboard-button";
import { BoxItemPreviewList } from "@/features/boxes/components/box-item-preview-list";

type Props = Readonly<{
  params: Promise<{ boxId: string }>;
}>;

export default async function BoxPreviewPage({ params }: Props) {
  const { boxId } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent boxId={boxId} />
    </Suspense>
  );
}

async function AwaitedContent({ boxId }: Readonly<{ boxId: string }>) {
  const boxDetails = await getBoxDetails(boxId);

  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <div className={"flex items-center gap-2"}>
          <h2 className={"text-2xl"}>Box - {boxDetails.title}</h2>
          <CopyBoxToClipboardButton items={boxDetails.items} />
        </div>
        <StartLearningButton
          boxId={boxDetails.boxId}
          isBoxStarted={boxDetails.isBoxStarted}
          disabled={!boxDetails.items.length}
        />
      </div>

      {boxDetails.items.length ? (
        <BoxItemPreviewList boxDetailsItems={boxDetails.items} />
      ) : (
        <div className={"mt-8"}>
          <NoItems />
        </div>
      )}
    </div>
  );
}

function Loader() {
  return <Spinner className={"w-8 h-8"} />;
}

function NoItems() {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center border">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Brak elementów w tym boxie
        </h3>
        <p className="text-sm text-muted-foreground">
          Ten box nie zawiera jeszcze żadnych pozycji do nauki.
        </p>
      </CardContent>
    </Card>
  );
}
