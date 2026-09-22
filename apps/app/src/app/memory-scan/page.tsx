import { Suspense } from "react";
import { Brain } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { getMemoryScanView } from "@/features/memory-scan/actions";
import { MemoryScanViewLogic } from "@/features/memory-scan/components/memory-scan-view-logic";

export default async function MemoryScanPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent />
    </Suspense>
  );
}

async function AwaitedContent() {
  const viewData = await getMemoryScanView();

  if (!viewData.success) {
    throw new Error("Nie udało się wczytać danych skanu pamięci.");
  }

  if (viewData.data.learnedItems.length === 0) return <NoLearnedItems />;

  return <MemoryScanViewLogic viewData={viewData.data} />;
}

function Loader() {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-12"
    >
      <Spinner className="size-8 text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">
        Wczytywanie skanu pamięci…
      </p>
    </div>
  );
}

function NoLearnedItems() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border bg-muted">
          <Brain className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Brak wyuczonych wyrażeń</h1>
          <p className="text-sm text-muted-foreground">
            Skan pamięci pozwala sprawdzić, ile wyuczonych wyrażeń potrafisz
            sobie przypomnieć. Wybierz box z menu i rozpocznij naukę, a potem
            wróć tutaj, aby sprawdzić swoją pamięć.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
