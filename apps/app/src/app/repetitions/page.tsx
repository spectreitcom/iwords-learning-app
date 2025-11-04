import { Suspense } from "react";
import {
  getRepetitions,
  removeAllRepetitions,
  removeRepetition,
} from "@/features/repetitions/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { expressionTypeMap } from "@/features/boxes/utils";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Search, Trash2 } from "lucide-react";
import { Repetition } from "@/features/repetitions/types";
import Link from "next/link";

export default async function RepetitionsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent />
    </Suspense>
  );
}

async function AwaitedContent() {
  const repetitions = await getRepetitions();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Powtórki</h2>
        {!!repetitions.length && (
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              onClick={removeAllRepetitions}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Usuń wszystkie
            </Button>

            <Button asChild size={"sm"}>
              <Link href={"/repetitions/learning"}>Zacznij powtórkę</Link>
            </Button>
          </div>
        )}
      </div>

      {!!repetitions.length ? (
        <div className="mt-8 flex flex-col gap-4">
          {repetitions.map((rep) => (
            <RepetitionItem key={rep.repetitionId} repetition={rep} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <NoItems />
        </div>
      )}
    </div>
  );
}

function RepetitionItem({
  repetition: { repetitionId, expressionContext },
}: {
  repetition: Repetition;
}) {
  return (
    <Card className="group">
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg">
              <strong>{expressionContext.phrase}</strong> -{" "}
              {expressionContext.translation}
            </h3>

            <div className="mt-2">
              <p>
                Typ wyrażenia:{" "}
                {expressionTypeMap.get(expressionContext.type) ??
                  expressionContext.type}
              </p>
              {expressionContext.type === "noun" && (
                <p>
                  Policzalny: {expressionContext.isCountable ? "Tak" : "Nie"}
                </p>
              )}
            </div>

            {expressionContext.type === "irregular_verb" &&
              expressionContext.forms && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">I forma</div>
                    <div className="font-medium">
                      {expressionContext.forms[0]}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">II forma</div>
                    <div className="font-medium">
                      {expressionContext.forms[1]}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">III forma</div>
                    <div className="font-medium">
                      {expressionContext.forms[2]}
                    </div>
                  </div>
                </div>
              )}

            {!!expressionContext.sentences?.length && (
              <div className="mt-4 flex flex-col gap-1">
                {expressionContext.sentences.map((s) => (
                  <div key={s.sentenceId}>
                    <span className="font-semibold">
                      {capitalizeFirstLetter(s.content)}
                    </span>{" "}
                    - {capitalizeFirstLetter(s.translation)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={removeRepetition.bind(null, repetitionId)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Usuń
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Loader() {
  return <Spinner className="w-8 h-8" />;
}

function NoItems() {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Brak powtórek
        </h3>
        <p className="text-sm text-gray-500">
          Nie masz żadnych zaplanowanych powtórek.
        </p>
      </CardContent>
    </Card>
  );
}
