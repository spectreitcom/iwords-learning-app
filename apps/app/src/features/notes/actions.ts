"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { collectionWithPaginationSchema } from "@/lib/types";
import { noteSchema } from "@/features/notes/types";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function getNote(noteId: string) {
  try {
    const response = await authFetch(`${BACKEND_URL}/notes/${noteId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch note: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    return noteSchema.parse(data);
  } catch (error) {
    console.error("Error in getNote:", error);
    throw error;
  }
}

export async function getNotes(
  expressionContextId: string,
  page = 1,
  take = 20,
) {
  try {
    const urlSearchParams = new URLSearchParams({
      page: page.toString(),
      take: take.toString(),
    });

    const response = await authFetch(
      `${BACKEND_URL}/notes/expression-context/${expressionContextId}?${urlSearchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch notes: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return collectionWithPaginationSchema(noteSchema).parse(data);
  } catch (error) {
    console.error("Error in getNotes:", error);
    throw error;
  }
}

export async function createNote(expressionContextId: string, title: string) {
  try {
    const response = await authFetch(`${BACKEND_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expressionContextId, title }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create note: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    revalidatePath(`/expression-context/${expressionContextId}/notes`);
    return z.object({ noteId: z.string().uuid() }).parse(data);
  } catch (error) {
    console.error("Error in createNote:", error);
    throw error;
  }
}

export async function deleteNote(expressionContextId: string, noteId: string) {
  try {
    const response = await authFetch(`${BACKEND_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete note: ${response.status} ${response.statusText}`,
      );
    }

    revalidatePath(`/expression-context/${expressionContextId}/notes`);
  } catch (error) {
    console.error("Error in deleteNote:", error);
    throw error;
  }
}

export async function updateNoteTitle(
  noteId: string,
  title: string,
  expressionContextId?: string,
) {
  try {
    const response = await authFetch(`${BACKEND_URL}/notes/${noteId}/title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update note title: ${response.status} ${response.statusText}`,
      );
    }

    if (expressionContextId) {
      revalidatePath(`/expression-context/${expressionContextId}/notes`);
    }
  } catch (error) {
    console.error("Error in updateNoteTitle:", error);
  }
}

export async function updateNoteContent(
  noteId: string,
  content: string,
  expressionContextId?: string,
) {
  try {
    const response = await authFetch(`${BACKEND_URL}/notes/${noteId}/content`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update note content: ${response.status} ${response.statusText}`,
      );
    }

    if (expressionContextId) {
      revalidatePath(`/expression-context/${expressionContextId}/notes`);
    }
  } catch (error) {
    console.error("Error in updateNoteContent:", error);
  }
}
