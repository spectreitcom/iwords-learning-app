import { Suspense } from "react";
import {
  getExpression,
  getExpressionContextDetails,
} from "@/features/dictionary/actions";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { expressionTypeMap } from "@/features/dictionary/utils";
import { ExpressionContextDefinitionForm } from "@/features/dictionary/components/expression-context-definition-form";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: Promise<{ expressionId: string; expressionContextId: string }>;
};

export default async function ExpressionContextDefinitionPage({
  params,
}: Props) {
  const { expressionId, expressionContextId } = await params;

  return (
    <Suspense fallback={<Loader />}>
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
      <div className={"mt-8"}>
        <ExpressionContextDefinitionForm
          expressionContextId={expressionContextId}
          defaultValues={{
            definition: expressionContext.definition ?? "",
            definitionTranslation:
              expressionContext.definitionTranslation ?? "",
          }}
        />
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div>
      <div>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-64 mt-2" />
        <Skeleton className="h-5 w-32 mt-2" />
      </div>
      <div className="mt-8">
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
