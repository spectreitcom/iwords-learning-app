import { Suspense } from "react";
import {
  getExpression,
  getExpressionContextDetails,
} from "@/features/dictionary/actions";
import { expressionTypeMap } from "@/features/dictionary/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sentence } from "@/features/dictionary/types";
import { SentencesTableItemActions } from "@/features/dictionary/components/sentences-table-item-actions";
import { AddSentenceModal } from "@/features/dictionary/components/add-sentence-modal";
import { NoDataPlaceholder } from "@/components/no-data-placeholder";
import { TableSkeletonLoader } from "@/components/table-skeleton-loader";
import { PageHeader } from "@/components/page-header";
import { GenerateSentences } from "@/features/dictionary/components/generate-sentences";

type Props = Readonly<{
  params: Promise<
    Readonly<{ expressionId: string; expressionContextId: string }>
  >;
}>;

export default async function ExpressionContextDetailsPage({ params }: Props) {
  const { expressionId, expressionContextId } = await params;
  return (
    <Suspense
      fallback={
        <TableSkeletonLoader
          headers={["Zdanie", "Tłumaczenie", ""]}
          showPagination={false}
        />
      }
    >
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
}: Readonly<{
  expressionId: string;
  expressionContextId: string;
}>) {
  const expression = await getExpression(expressionId);
  const expressionContext =
    await getExpressionContextDetails(expressionContextId);

  return (
    <div>
      <PageHeader
        title={`${expression.phrase} - ${expressionContext.translation}`}
        backLink={{ href: `/expressions/${expressionId}` }}
        subtitle={`Typ: ${expressionTypeMap.get(expressionContext.type)}`}
      />
      <div className={"flex justify-end"}>
        <AddSentenceModal
          expressionId={expressionId}
          expressionContextId={expressionContextId}
        />
      </div>
      <div className={"mt-4"}>
        <GenerateSentences
          expressionId={expressionId}
          expressionContextId={expressionContextId}
        />
      </div>
      <div className={"mt-4"}>
        <SentencesList
          sentences={expressionContext.sentences ?? []}
          expressionId={expressionId}
          expressionContextId={expressionContextId}
        />
      </div>
    </div>
  );
}

function SentencesList({
  sentences,
  expressionId,
  expressionContextId,
}: Readonly<{
  sentences: Sentence[];
  expressionId: string;
  expressionContextId: string;
}>) {
  if (!sentences.length)
    return (
      <NoDataPlaceholder
        heading="Brak zdań"
        description="Nie znaleziono żadnych zdań dla tego kontekstu wyrażenia."
        description2="Dodaj przykładowe zdania, aby pokazać użycie tego wyrażenia w kontekście"
      />
    );

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
              <SentencesTableItemActions
                sentence={sentence}
                expressionId={expressionId}
                expressionContextId={expressionContextId}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
