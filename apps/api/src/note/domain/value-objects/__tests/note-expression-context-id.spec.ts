import { NoteExpressionContextId } from '../note-expression-context-id';

describe('NoteExpressionContextId', () => {
  describe('fromString', () => {
    it('should create NoteExpressionContextId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const noteExpressionContextId =
        NoteExpressionContextId.fromString(validUuid);

      expect(noteExpressionContextId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => NoteExpressionContextId.fromString(invalidUuid)).toThrow(
        'NoteExpressionContextId is not valid',
      );
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const noteExpressionContextId1 = NoteExpressionContextId.fromString(uuid);
      const noteExpressionContextId2 = NoteExpressionContextId.fromString(uuid);

      expect(noteExpressionContextId1.equals(noteExpressionContextId2)).toBe(
        true,
      );
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const noteExpressionContextId1 =
        NoteExpressionContextId.fromString(uuid1);
      const noteExpressionContextId2 =
        NoteExpressionContextId.fromString(uuid2);

      expect(noteExpressionContextId1.equals(noteExpressionContextId2)).toBe(
        false,
      );
    });
  });
});
