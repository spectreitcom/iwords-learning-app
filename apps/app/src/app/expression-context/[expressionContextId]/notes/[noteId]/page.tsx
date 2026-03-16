import { Spinner } from "@repo/ui/components/ui/spinner";
import { Suspense } from "react";

type Props = Readonly<{
  params: Promise<{ expressionContextId: string; noteId: string }>;
}>;

export default function NotePage({ params }: Props) {
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent />
    </Suspense>
  );
}

function AwaitedContent() {
  return "";
}

function Loader() {
  return <Spinner className={"w-8 h-8"} />;
}
