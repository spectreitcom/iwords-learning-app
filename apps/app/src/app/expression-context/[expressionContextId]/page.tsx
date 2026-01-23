import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getExpressionContext } from "@/features/dictionary/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = Readonly<{
  params: Promise<{ expressionContextId: string }>;
}>;

export default async function ExpressionContextPage({ params }: Props) {
  const { expressionContextId } = await params;

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<Loader />}>
        <AwaitedContent expressionContextId={expressionContextId} />
      </Suspense>
    </div>
  );
}

async function AwaitedContent({
  expressionContextId,
}: {
  expressionContextId: string;
}) {
  const context = await getExpressionContext(expressionContextId);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">
                {context.phrase}
              </CardTitle>
              <p className="text-xl text-muted-foreground mt-1">
                {context.translation}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge variant="secondary">{context.type}</Badge>
              {context.isIrregular && (
                <Badge variant="destructive">Nieregularny</Badge>
              )}
              {context.isCountable && (
                <Badge variant="outline">Policzalny</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(context.definition || context.definitionTranslation) && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-1 text-sm uppercase text-muted-foreground tracking-wider">
                Definicja
              </h3>
              {context.definition && (
                <p className="text-base italic mb-1">{context.definition}</p>
              )}
              {context.definitionTranslation && (
                <p className="text-sm text-muted-foreground">
                  {context.definitionTranslation}
                </p>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground tracking-wider">
              Przykłady
            </h3>
            <div className="space-y-4">
              {context.sentences.map((sentence) => (
                <div
                  key={sentence.sentenceId}
                  className="border-l-4 border-primary pl-4 py-1"
                >
                  <p className="text-lg mb-1">{sentence.content}</p>
                  <p className="text-sm text-muted-foreground">
                    {sentence.translation}
                  </p>
                </div>
              ))}
              {context.sentences.length === 0 && (
                <p className="text-muted-foreground italic">Brak przykładów.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-32">
      <Spinner className="w-8 h-8" />
    </div>
  );
}
