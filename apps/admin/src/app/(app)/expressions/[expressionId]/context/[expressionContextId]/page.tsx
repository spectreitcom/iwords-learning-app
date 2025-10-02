import { Suspense } from "react";
import {
  getExpression,
  getExpressionContextDetails,
} from "@/features/dictionary/actions";
import Link from "next/link";
import { ChevronLeftIcon, FileText } from "lucide-react";
import { expressionTypeMap } from "@/features/dictionary/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Sentence } from "@/features/dictionary/types";
import { SentencesTableItemActions } from "@/features/dictionary/components/sentences-table-item-actions";
import { AddSentenceModal } from "@/features/dictionary/components/add-sentence-modal";

type Props = {
  params: Promise<{ expressionId: string; expressionContextId: string }>;
};

export default async function ExpressionContextDetailsPage({ params }: Props) {
  const { expressionId, expressionContextId } = await params;
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <AwaitedContent
        expressionId={expressionId}
        expressionContextId={expressionContextId}
      />
    </Suspense>
  );
}

async function AwaitedContent({
  expressionId,
  expressionContextId,
}: {
  expressionId: string;
  expressionContextId: string;
}) {
  const expression = await getExpression(expressionId);
  const expressionContext =
    await getExpressionContextDetails(expressionContextId);

  return (
    <div>
      <div>
        <Link
          href={`/expressions/${expressionId}`}
          className={"flex items-center gap-2"}
        >
          <ChevronLeftIcon />
          Powrót
        </Link>
        <h1 className={"text-2xl mt-2"}>
          {expression.phrase} - {expressionContext.translation}
        </h1>
        <p>Typ: {expressionTypeMap.get(expressionContext.type)}</p>
      </div>
      <div className={"mt-8 flex justify-end"}>
        <AddSentenceModal
          expressionId={expressionId}
          expressionContextId={expressionContextId}
        />
      </div>
      <div className={"mt-4"}>
        <SentencesList sentences={expressionContext.sentences ?? []} />
      </div>
    </div>
  );
}

function SentencesList({ sentences }: { sentences: Sentence[] }) {
  if (!sentences.length) return <NoData />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Zdanie</TableHead>
          <TableHead>Tłumaczenie</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sentences.map((sentence) => (
          <TableRow key={sentence.sentenceId}>
            <TableCell>{sentence.content}</TableCell>
            <TableCell>{sentence.translation}</TableCell>
            <TableCell className={"flex justify-end"}>
              <SentencesTableItemActions />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        {/* Back link skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-4 w-4 bg-gray-200 rounded"
            style={{
              background:
                "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div
            className="h-4 w-16 bg-gray-200 rounded"
            style={{
              background:
                "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        </div>
        {/* Title skeleton */}
        <div
          className="h-8 w-3/4 bg-gray-200 rounded mb-2"
          style={{
            background:
              "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        {/* Type skeleton */}
        <div
          className="h-4 w-24 bg-gray-200 rounded"
          style={{
            background:
              "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Button skeleton */}
      <div className="flex justify-end">
        <div
          className="h-10 w-32 bg-gray-200 rounded-md"
          style={{
            background:
              "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Table skeleton */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Zdanie</TableHead>
            <TableHead>Tłumaczenie</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-b">
              <TableCell>
                <div
                  className="h-4 w-5/6 bg-gray-200 rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              </TableCell>
              <TableCell>
                <div
                  className="h-4 w-4/5 bg-gray-200 rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              </TableCell>
              <TableCell className="flex justify-end">
                <div
                  className="h-8 w-8 bg-gray-200 rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function NoData() {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak zdań</h3>
        <p className="text-sm text-gray-500 mb-4">
          Nie znaleziono żadnych zdań dla tego kontekstu wyrażenia.
        </p>
        <div className="text-xs text-gray-400">
          Dodaj przykładowe zdania, aby pokazać użycie tego wyrażenia w
          kontekście
        </div>
      </CardContent>
    </Card>
  );
}
