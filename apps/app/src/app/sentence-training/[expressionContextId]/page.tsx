import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { notFound } from "next/navigation";
import { SentenceTrainer } from "@/features/sentence-training/components/sentence-trainer";
import { getExpressionContext } from "@/features/dictionary/actions";

type Props = Readonly<{
  params: Promise<{ expressionContextId: string }>;
}>;

export default async function SentenceTrainingPage({ params }: Props) {
  const { expressionContextId } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent expressionContextId={expressionContextId} />
    </Suspense>
  );
}

async function AwaitedContent({
  expressionContextId,
}: Readonly<{
  expressionContextId: string;
}>) {
  const expressionContext = await getExpressionContext(expressionContextId);
  if (!expressionContext) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Trener zdań</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ćwicz tworzenie zdań ze słówkiem i otrzymuj informację zwrotną.
        </p>
      </div>

      <SentenceTrainer
        expressionContextId={expressionContextId}
        phrase={expressionContext.phrase}
        translation={expressionContext.translation}
      />
    </div>
  );
}

function Loader() {
  return <Spinner className="w-8 h-8" />;
}
