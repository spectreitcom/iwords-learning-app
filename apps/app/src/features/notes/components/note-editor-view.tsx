"use client";

import { Note } from "@/features/notes/types";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type ChangeEvent,
  type ComponentType,
} from "react";
import { updateNoteTitle, updateNoteContent } from "@/features/notes/actions";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { debounce } from "lodash";
import { EditorState, type Command } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import { DOMParser, DOMSerializer } from "prosemirror-model";
import { addListNodes, wrapInList } from "prosemirror-schema-list";
import { setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import DOMPurify from "dompurify";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

import "prosemirror-view/style/prosemirror.css";

const editorSchema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
  marks: basicSchema.spec.marks,
});

type ToolbarItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  command: Command;
  isActive?: (state: EditorState) => boolean;
};

interface NoteEditorViewProps {
  note: Note;
}

export function NoteEditorView({ note }: NoteEditorViewProps) {
  const [title, setTitle] = useState(note.title);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const toolbarItems = useMemo<ToolbarItem[]>(
    () => [
      {
        label: "Akapit",
        icon: Pilcrow,
        command: setBlockType(editorSchema.nodes.paragraph),
        isActive: (state) => isBlockActive(state, "paragraph"),
      },
      {
        label: "Nagłówek 1",
        icon: Heading1,
        command: setBlockType(editorSchema.nodes.heading, { level: 1 }),
        isActive: (state) => isHeadingActive(state, 1),
      },
      {
        label: "Nagłówek 2",
        icon: Heading2,
        command: setBlockType(editorSchema.nodes.heading, { level: 2 }),
        isActive: (state) => isHeadingActive(state, 2),
      },
      {
        label: "Pogrubienie",
        icon: Bold,
        command: toggleMark(editorSchema.marks.strong),
        isActive: (state) => isMarkActive(state, "strong"),
      },
      {
        label: "Kursywa",
        icon: Italic,
        command: toggleMark(editorSchema.marks.em),
        isActive: (state) => isMarkActive(state, "em"),
      },
      {
        label: "Lista punktowana",
        icon: List,
        command: wrapInList(editorSchema.nodes.bullet_list),
        isActive: (state) => isNodeActive(state, "bullet_list"),
      },
      {
        label: "Lista numerowana",
        icon: ListOrdered,
        command: wrapInList(editorSchema.nodes.ordered_list),
        isActive: (state) => isNodeActive(state, "ordered_list"),
      },
      {
        label: "Cytat",
        icon: Quote,
        command: wrapIn(editorSchema.nodes.blockquote),
        isActive: (state) => isNodeActive(state, "blockquote"),
      },
    ],
    [],
  );

  const debouncedUpdateTitle = useMemo(
    () =>
      debounce(async (id: string, newTitle: string, ctxId: string) => {
        await updateNoteTitle(id, newTitle, ctxId);
      }, 1000),
    [],
  );

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      doc: DOMParser.fromSchema(editorSchema).parse(contentElement),
      plugins: exampleSetup({ schema: editorSchema, menuBar: false }),
    });

    const view = new EditorView(editorRef.current, {
      state,
      attributes: {
        class: "note-prosemirror",
        "data-placeholder": "Zacznij pisać notatkę...",
      },
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        setEditorState(newState);

        if (transaction.docChanged) {
          const fragment = DOMSerializer.fromSchema(
            editorSchema,
          ).serializeFragment(newState.doc.content);
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
    setEditorState(view.state);

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

  const runCommand = (command: Command) => {
    const view = viewRef.current;

    if (!view) return;

    command(view.state, view.dispatch, view);
    view.focus();
    setEditorState(view.state);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card/70 px-5 py-4 shadow-sm backdrop-blur">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Tytuł notatki"
          className="h-auto border-none bg-transparent px-0 py-1 text-3xl font-bold tracking-normal shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card/85 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 px-2 py-2">
          {toolbarItems.map((item, index) => (
            <ToolbarButton
              key={item.label}
              item={item}
              editorState={editorState}
              onRun={() => runCommand(item.command)}
              separatorBefore={index === 3 || index === 5}
            />
          ))}
        </div>

        <div
          ref={editorRef}
          className="prose prose-sm max-w-none p-5 text-foreground sm:prose-base dark:prose-invert"
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  item,
  editorState,
  onRun,
  separatorBefore = false,
}: {
  item: ToolbarItem;
  editorState: EditorState | null;
  onRun: () => void;
  separatorBefore?: boolean;
}) {
  const Icon = item.icon;
  const isActive = editorState ? item.isActive?.(editorState) : false;
  const isDisabled = editorState ? !item.command(editorState) : true;

  return (
    <>
      {separatorBefore && <div className="mx-1 h-6 w-px bg-border" />}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={item.label}
            disabled={isDisabled}
            onMouseDown={(event) => {
              event.preventDefault();
              onRun();
            }}
            className={cn(
              "size-8 rounded-md text-muted-foreground",
              isActive && "bg-primary/10 text-primary hover:bg-primary/15",
            )}
          >
            <Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{item.label}</TooltipContent>
      </Tooltip>
    </>
  );
}

function isMarkActive(state: EditorState, markName: string) {
  const markType = editorSchema.marks[markName];

  if (!markType) return false;

  const { from, $from, to, empty } = state.selection;
  return empty
    ? !!markType.isInSet(state.storedMarks ?? $from.marks())
    : state.doc.rangeHasMark(from, to, markType);
}

function isBlockActive(state: EditorState, nodeName: string) {
  const nodeType = editorSchema.nodes[nodeName];

  if (!nodeType) return false;

  const { $from } = state.selection;
  return $from.parent.type === nodeType;
}

function isHeadingActive(state: EditorState, level: number) {
  const { $from } = state.selection;
  return (
    $from.parent.type === editorSchema.nodes.heading &&
    $from.parent.attrs.level === level
  );
}

function isNodeActive(state: EditorState, nodeName: string) {
  const nodeType = editorSchema.nodes[nodeName];

  if (!nodeType) return false;

  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if ($from.node(depth).type === nodeType) return true;
  }

  return false;
}
