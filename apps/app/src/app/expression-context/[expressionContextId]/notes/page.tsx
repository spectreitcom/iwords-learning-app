import { Spinner } from "@repo/ui/components/ui/spinner";
import { Suspense } from "react";
import { getNotes } from "@/features/notes/actions";
import { Note } from "@/features/notes/types";
import { NewNoteButton } from "@/features/notes/components/new-note-button";
import { NoteItem } from "@/features/notes/components/note-item";
import { Pagination } from "@/components/pagination";
import { getExpressionContext } from "@/features/dictionary/actions";
import { Badge } from "@repo/ui/components/ui/badge";
import { expressionTypeMap } from "@repo/shared/utils";
import { PronunciationButton } from "@/components/pronunciation-button";

type Props = Readonly<{
  params: Promise<{ expressionContextId: string }>;
  searchParams: Promise<{ page?: string; take?: string }>;
}>;

export default async function NotesPage({ params, searchParams }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notatki</h1>
        <Suspense fallback={null}>
          <NewNoteButtonWrapper params={params} />
        </Suspense>
      </div>
      <Suspense fallback={<Loader />}>
        <AwaitedContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function NewNoteButtonWrapper({
  params,
}: {
  params: Promise<{ expressionContextId: string }>;
}) {
  const { expressionContextId } = await params;
  return <NewNoteButton expressionContextId={expressionContextId} />;
}

async function AwaitedContent({
  params,
  searchParams,
}: {
  params: Promise<{ expressionContextId: string }>;
  searchParams: Promise<{ page?: string; take?: string }>;
}) {
  const { expressionContextId } = await params;
  const searchParamsValue = await searchParams;
  const { page: pageStr, take: takeStr } = searchParamsValue;
  const page = pageStr ? parseInt(pageStr) : 1;
  const take = takeStr ? parseInt(takeStr) : 20;

  const notes = await getNotes(expressionContextId, page, take);
  const expressionContext = await getExpressionContext(expressionContextId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {expressionContext.phrase}
          </h2>
          <PronunciationButton text={expressionContext.phrase} />
          <Badge variant="secondary" className="ml-auto">
            {expressionTypeMap.get(expressionContext.type)}
          </Badge>
        </div>
        <p className="text-muted-foreground">{expressionContext.translation}</p>
      </div>

      {notes.total === 0 ? (
        <NoItems />
      ) : (
        <div className="flex flex-col gap-6">
          <NotesList notes={notes.data} />
          <Pagination
            currentPage={notes.currentPage}
            total={notes.total}
            take={take}
            otherSearchParams={searchParamsValue as Record<string, string>}
          />
        </div>
      )}
    </div>
  );
}

function NotesList({ notes }: { notes: Note[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-48">
      <Spinner className={"w-8 h-8"} />
    </div>
  );
}

function NoItems() {
  return (
    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/10">
      <p className="text-muted-foreground">Brak notatek dla tego kontekstu.</p>
    </div>
  );
}
