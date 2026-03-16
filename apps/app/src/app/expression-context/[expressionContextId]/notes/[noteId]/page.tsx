import { Spinner } from "@repo/ui/components/ui/spinner";
import { Suspense } from "react";
import { getNote } from "@/features/notes/actions";
import { NoteEditorView } from "@/features/notes/components/note-editor-view";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = Readonly<{
  params: Promise<{ expressionContextId: string; noteId: string }>;
}>;

export default function NotePage({ params }: Props) {
  return (
    <Suspense fallback={<Loader />}>
      <AwaitedContent params={params} />
    </Suspense>
  );
}

async function AwaitedContent({
  params,
}: {
  params: Promise<{ expressionContextId: string; noteId: string }>;
}) {
  const { noteId } = await params;
  const note = await getNote(noteId);

  if (!note) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <p>Notatka nie została znaleziona.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/">Wróć do strony głównej</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-4 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/expression-context/${note.expressionContextId}/notes`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">Powrót do notatek</span>
      </div>
      <NoteEditorView note={note} />
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner className={"w-12 h-12"} />
    </div>
  );
}
