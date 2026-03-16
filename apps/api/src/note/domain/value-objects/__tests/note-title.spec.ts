import { NoteTitle } from '../note-title';

describe('NoteTitle', () => {
  describe('fromString', () => {
    it('should create NoteTitle with valid string', () => {
      const validTitle = 'Valid Note Title';
      const noteTitle = NoteTitle.fromString(validTitle);

      expect(noteTitle.value).toBe(validTitle);
    });

    it('should throw error for empty string', () => {
      const emptyTitle = '';

      expect(() => NoteTitle.fromString(emptyTitle)).toThrow(
        'NoteTitle is not valid',
      );
    });

    it('should throw error for too long string', () => {
      const longTitle = 'a'.repeat(121);

      expect(() => NoteTitle.fromString(longTitle)).toThrow(
        'NoteTitle is not valid',
      );
    });

    it('should accept title with maximum allowed length', () => {
      const maxTitle = 'a'.repeat(120);
      const noteTitle = NoteTitle.fromString(maxTitle);

      expect(noteTitle.value).toHaveLength(120);
    });
  });

  describe('equals', () => {
    it('should return true for same title values', () => {
      const title = 'Some Title';
      const noteTitle1 = NoteTitle.fromString(title);
      const noteTitle2 = NoteTitle.fromString(title);

      expect(noteTitle1.equals(noteTitle2)).toBe(true);
    });

    it('should return false for different title values', () => {
      const title1 = 'Title 1';
      const title2 = 'Title 2';
      const noteTitle1 = NoteTitle.fromString(title1);
      const noteTitle2 = NoteTitle.fromString(title2);

      expect(noteTitle1.equals(noteTitle2)).toBe(false);
    });
  });
});
