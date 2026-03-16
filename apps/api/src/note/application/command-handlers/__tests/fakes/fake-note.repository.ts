import { NoteRepository } from '../../../ports/note.repository';
import { Note } from '../../../../domain/note';
import { PrismaTx } from '../../../../../common/types';

export class FakeNoteRepository implements NoteRepository {
  private notes: Map<string, Note> = new Map();

  async save(note: Note, _tx?: PrismaTx): Promise<void> {
    this.notes.set(note.getNoteId().value, note);
  }

  async findById(noteId: string, _tx?: PrismaTx): Promise<Note | null> {
    return this.notes.get(noteId) || null;
  }

  async delete(noteId: string, _tx?: PrismaTx): Promise<void> {
    this.notes.delete(noteId);
  }

  getLength(): number {
    return this.notes.size;
  }
}
