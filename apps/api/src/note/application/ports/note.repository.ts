import { Note } from '../../domain/note';
import { PrismaTx } from '../../../common/types';

export abstract class NoteRepository {
  abstract save(note: Note, tx?: PrismaTx): Promise<void>;
  abstract findById(noteId: string, tx?: PrismaTx): Promise<Note | null>;
}
