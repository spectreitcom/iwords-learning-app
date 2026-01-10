import { Suspense } from "react";
import { getBoxDetails } from "@/features/boxes/actions";
import { BoxItem } from "@/features/boxes/types";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { expressionTypeMap } from "@/features/boxes/utils";
import { capitalizeFirstLetter } from "@/lib/utils";
import { MoreVertical, Search } from "lucide-react";
import { StartLearningButton } from "@/features/learning/components/start-learning-button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
        <h2 className={"text-2xl"}>Box - {boxDetails.title}</h2>
        <StartLearningButton
          boxId={boxDetails.boxId}
          isBoxStarted={boxDetails.isBoxStarted}
          disabled={!boxDetails.items.length}
        />
      </div>

      {boxDetails.items.length ? (
        <div className={"mt-8 flex flex-col gap-4"}>
          {boxDetails.items.map((item) => (
            <BoxItemPreview key={item.expressionContextId} item={item} />
          ))}
        </div>
      ) : (
        <div className={"mt-8"}>
          <NoItems />
        </div>
      )}
    </div>
  );
}

function BoxItemPreview({ item }: Readonly<{ item: BoxItem }>) {
  return (
    <Card className={"group"}>
      <CardContent>
        <div className={"flex items-start justify-between gap-2"}>
          <h3 className={"text-lg"}>
            <strong>{item.phrase}</strong> - {item.translation}
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Akcje pozycji"
              >
                <MoreVertical className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/sentence-training/${item.expressionContextId}`}>
                  Trenuj wyrażenie w zdaniach
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={"mt-2"}>
          <p>Typ wyrażenia: {expressionTypeMap.get(item.type)}</p>
          {item.type === "noun" && (
            <p>Policzalny: {item.isCountable ? "Tak" : "Nie"}</p>
          )}
        </div>

        {item.definition && (
          <div className={"mt-4"}>
            <p>
              <strong>Definicja:</strong> {item.definition}
            </p>
            {item.definitionTranslation && (
              <p className={"mt-4"}>
                <strong>Tłumaczenie definicji:</strong>{" "}
                {item.definitionTranslation}
              </p>
            )}
          </div>
        )}

        {item.type === "irregular_verb" && (
          <div className={"mt-4"}>
            <IrregularVerbTable forms={item.forms ?? []} />
          </div>
        )}

        {item.sentences.length && (
          <div className={"mt-4 flex flex-col gap-1"}>
            {item.sentences.map((sentence) => (
              <div key={sentence.sentenceId}>
                <span className={"font-semibold"}>
                  {capitalizeFirstLetter(sentence.content)}
                </span>{" "}
                - {capitalizeFirstLetter(sentence.translation)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IrregularVerbTable({ forms }: Readonly<{ forms: string[] }>) {
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
          <TableCell>{forms[0]}</TableCell>
          <TableCell>{forms[1]}</TableCell>
          <TableCell>{forms[2]}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function Loader() {
  return <Spinner className={"w-8 h-8"} />;
}

function NoItems() {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Brak elementów w tym boxie
        </h3>
        <p className="text-sm text-gray-500">
          Ten box nie zawiera jeszcze żadnych pozycji do nauki.
        </p>
      </CardContent>
    </Card>
  );
}
