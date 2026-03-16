import { Note } from '../note';
import { NoteId } from '../value-objects/note-id';
import { NoteUserId } from '../value-objects/note-user-id';
import { NoteExpressionContextId } from '../value-objects/note-expression-context-id';
import { NoteTitle } from '../value-objects/note-title';

describe('Note', () => {
  const validUserId = '07360212-32a8-4443-85e6-905c1d683050';
  const validExpressionContextId = '07360212-32a8-4443-85e6-905c1d683051';
  const validTitle = 'My Note Title';
  const validContent = 'This is the content of my note.';

  describe('create', () => {
    it('should create a new Note instance with valid data', () => {
      const note = Note.create(
        validUserId,
        validExpressionContextId,
        validTitle,
      );

      expect(note).toBeDefined();
      expect(note.getNoteId()).toBeInstanceOf(NoteId);
      expect(note.getUserId().value).toBe(validUserId);
      expect(note.getExpressionContextId().value).toBe(
        validExpressionContextId,
      );
      expect(note.getTitle().value).toBe(validTitle);
      expect(note.getContent()).toBeUndefined();
    });

    it('should throw an error if userId is not a valid UUID', () => {
      expect(() => {
        Note.create('invalid-uuid', validExpressionContextId, validTitle);
      }).toThrow('NoteUserId is not valid');
    });

    it('should throw an error if expressionContextId is not a valid UUID', () => {
      expect(() => {
        Note.create(validUserId, 'invalid-uuid', validTitle);
      }).toThrow('NoteExpressionContextId is not valid');
    });

    it('should throw an error if title is too short', () => {
      expect(() => {
        Note.create(validUserId, validExpressionContextId, 'ab');
      }).toThrow('NoteTitle is not valid');
    });

    it('should throw an error if title is too long', () => {
      const longTitle = 'a'.repeat(121);
      expect(() => {
        Note.create(validUserId, validExpressionContextId, longTitle);
      }).toThrow('NoteTitle is not valid');
    });
  });

  describe('updateTitle', () => {
    it('should update the title of the note', () => {
      const note = Note.create(
        validUserId,
        validExpressionContextId,
        validTitle,
      );
      const newTitle = 'Updated Title';

      note.updateTitle(newTitle);

      expect(note.getTitle().value).toBe(newTitle);
    });

    it('should throw an error if new title is invalid', () => {
      const note = Note.create(
        validUserId,
        validExpressionContextId,
        validTitle,
      );

      expect(() => {
        note.updateTitle('sh');
      }).toThrow('NoteTitle is not valid');
    });
  });

  describe('updateContent', () => {
    it('should update the content of the note', () => {
      const note = Note.create(
        validUserId,
        validExpressionContextId,
        validTitle,
      );

      note.updateContent(validContent);

      expect(note.getContent()).toBe(validContent);
    });

    it('should allow clearing the content', () => {
      const note = Note.create(
        validUserId,
        validExpressionContextId,
        validTitle,
      );
      note.updateContent(validContent);
      expect(note.getContent()).toBe(validContent);

      note.updateContent('');

      expect(note.getContent()).toBe('');
    });
  });

  describe('constructor', () => {
    it('should initialize properties correctly when using constructor', () => {
      const noteId = NoteId.create();
      const userId = NoteUserId.fromString(validUserId);
      const expressionContextId = NoteExpressionContextId.fromString(
        validExpressionContextId,
      );
      const title = NoteTitle.fromString(validTitle);

      const note = new Note(
        noteId,
        userId,
        expressionContextId,
        title,
        validContent,
      );

      expect(note.getNoteId()).toBe(noteId);
      expect(note.getUserId()).toBe(userId);
      expect(note.getExpressionContextId()).toBe(expressionContextId);
      expect(note.getTitle()).toBe(title);
      expect(note.getContent()).toBe(validContent);
    });
  });
});
