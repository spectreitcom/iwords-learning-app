import { NoteId } from '../note-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

describe('NoteId', () => {
  describe('fromString', () => {
    it('should create NoteId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const noteId = NoteId.fromString(validUuid);

      expect(noteId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => NoteId.fromString(invalidUuid)).toThrow(
        'NoteId is not valid',
      );
    });
  });

  describe('create', () => {
    it('should create NoteId with valid UUID', () => {
      const noteId = NoteId.create();

      expect(isValidUUID(noteId.value)).toBe(true);
    });

    it('should generate different UUIDs on multiple calls', () => {
      const noteId1 = NoteId.create();
      const noteId2 = NoteId.create();

      expect(noteId1.value).not.toBe(noteId2.value);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const noteId1 = NoteId.fromString(uuid);
      const noteId2 = NoteId.fromString(uuid);

      expect(noteId1.equals(noteId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const noteId1 = NoteId.fromString(uuid1);
      const noteId2 = NoteId.fromString(uuid2);

      expect(noteId1.equals(noteId2)).toBe(false);
    });
  });
});
