import { NoteUserId } from '../note-user-id';

describe('NoteUserId', () => {
  describe('fromString', () => {
    it('should create NoteUserId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const noteUserId = NoteUserId.fromString(validUuid);

      expect(noteUserId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => NoteUserId.fromString(invalidUuid)).toThrow(
        'NoteUserId is not valid',
      );
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const noteUserId1 = NoteUserId.fromString(uuid);
      const noteUserId2 = NoteUserId.fromString(uuid);

      expect(noteUserId1.equals(noteUserId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const noteUserId1 = NoteUserId.fromString(uuid1);
      const noteUserId2 = NoteUserId.fromString(uuid2);

      expect(noteUserId1.equals(noteUserId2)).toBe(false);
    });
  });
});
