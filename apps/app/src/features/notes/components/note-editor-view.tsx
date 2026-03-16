"use client";

import { Note } from "@/features/notes/types";
import { useState, useEffect, useRef, useMemo } from "react";
import { updateNoteTitle, updateNoteContent } from "@/features/notes/actions";
import { Input } from "@repo/ui/components/ui/input";
import { debounce } from "lodash";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import { DOMParser, DOMSerializer } from "prosemirror-model";
import DOMPurify from "dompurify";

import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";
import "prosemirror-example-setup/style/style.css";

interface NoteEditorViewProps {
  note: Note;
}

export function NoteEditorView({ note }: NoteEditorViewProps) {
  const [title, setTitle] = useState(note.title);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const debouncedUpdateTitle = useMemo(
    () =>
      debounce(async (id: string, newTitle: string, ctxId: string) => {
        await updateNoteTitle(id, newTitle, ctxId);
      }, 1000),
    [],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedUpdateTitle(note.id, newTitle, note.expressionContextId);
  };

  const debouncedUpdateContent = useMemo(
    () =>
      debounce(async (id: string, content: string, ctxId: string) => {
        await updateNoteContent(id, content, ctxId);
      }, 1000),
    [],
  );

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const contentElement = document.createElement("div");
    contentElement.innerHTML = DOMPurify.sanitize(note.content || "");

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(contentElement),
      plugins: exampleSetup({ schema }),
    });

    // Create view
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        if (transaction.docChanged) {
          const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
            newState.doc.content,
          );
          const tempDiv = document.createElement("div");
          tempDiv.appendChild(fragment);
          debouncedUpdateContent(
            note.id,
            tempDiv.innerHTML,
            note.expressionContextId,
          );
        }
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
      debouncedUpdateContent.cancel();
      debouncedUpdateTitle.cancel();
    };
  }, [
    note.id,
    note.expressionContextId,
    note.content,
    debouncedUpdateContent,
    debouncedUpdateTitle,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Tytuł notatki"
          className="h-auto border-none bg-transparent px-0 py-2 text-3xl font-bold shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="prose prose-sm max-w-none sm:prose lg:prose-lg xl:prose-xl">
        <div
          ref={editorRef}
          className="prosemirror-editor min-h-[300px] rounded-md border bg-background p-4 focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 [&_.ProseMirror_p]:mb-2 [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
}
