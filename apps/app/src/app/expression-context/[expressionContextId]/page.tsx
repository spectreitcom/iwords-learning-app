import { Suspense } from "react";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { getExpressionContext } from "@/features/dictionary/actions";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { expressionTypeMap } from "@repo/shared/utils";
import { PronunciationButton } from "@/components/pronunciation-button";

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
}: Readonly<{
  expressionContextId: string;
}>) {
  const context = await getExpressionContext(expressionContextId);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl font-bold">
                  {context.phrase}
                </CardTitle>
                <PronunciationButton text={context.phrase} />
              </div>
              <p className="text-xl text-muted-foreground mt-1">
                {context.translation}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge variant="secondary">
                {expressionTypeMap.get(context.type)}
              </Badge>
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

          {context.isIrregular &&
            Array.isArray(context.forms) &&
            context.forms.length >= 3 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground tracking-wider">
                  Formy nieregularne
                </h3>
                <IrregularVerbTable forms={context.forms} />
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
                  <div className="flex items-center gap-2 mb-1">
                    <PronunciationButton text={sentence.content} />
                    <p className="text-lg">{sentence.content}</p>
                  </div>
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

function IrregularVerbTable({ forms }: Readonly<{ forms: string[] }>) {
  if (forms.length < 3) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>I forma</TableHead>
          <TableHead>II forma</TableHead>
          <TableHead>III forma</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex items-center gap-2">
              <PronunciationButton text={forms[0]!} />
              {forms[0]}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <PronunciationButton text={forms[1]!} />
              {forms[1]}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <PronunciationButton text={forms[2]!} />
              {forms[2]}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
