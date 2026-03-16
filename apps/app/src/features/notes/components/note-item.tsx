import { Note } from "@/features/notes/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/ui/card";
import Link from "next/link";
import { NoteItemDropdownMenu } from "@/features/notes/components/note-item-dropdown-menu";

export function NoteItem({ note }: { note: Note }) {
  return (
    <div className="group relative">
      <Link
        href={`/expression-context/${note.expressionContextId}/notes/${note.id}`}
      >
        <Card className="hover:bg-muted/50 h-full transition-colors cursor-pointer border-none shadow-none bg-muted/20">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-lg line-clamp-1 pr-8">
              {note.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-4">
              {note.updatedAt.toLocaleDateString("pl-PL")}
            </p>
          </CardContent>
        </Card>
      </Link>
      <NoteItemDropdownMenu
        noteId={note.id}
        expressionContextId={note.expressionContextId}
        className="absolute top-4 right-4"
      />
    </div>
  );
}
