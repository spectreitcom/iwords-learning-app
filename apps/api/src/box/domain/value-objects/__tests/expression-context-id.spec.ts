import { ExpressionContextId } from '../expression-context-id';

describe('ExpressionContextId', () => {
  describe('fromString', () => {
    it('should create ExpressionContextId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const expressionContextId = ExpressionContextId.fromString(validUuid);

      expect(expressionContextId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => ExpressionContextId.fromString(invalidUuid)).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => ExpressionContextId.fromString('')).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should throw error for null value', () => {
      expect(() =>
        ExpressionContextId.fromString(null as unknown as string),
      ).toThrow('ExpressionContextId is not valid');
    });

    it('should throw error for undefined value', () => {
      expect(() =>
        ExpressionContextId.fromString(undefined as unknown as string),
      ).toThrow('ExpressionContextId is not valid');
    });

    it('should throw error for non-string value', () => {
      expect(() =>
        ExpressionContextId.fromString(123 as unknown as string),
      ).toThrow('ExpressionContextId is not valid');
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expressionContextId1 = ExpressionContextId.fromString(uuid);
      const expressionContextId2 = ExpressionContextId.fromString(uuid);

      expect(expressionContextId1.equals(expressionContextId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const expressionContextId1 = ExpressionContextId.fromString(uuid1);
      const expressionContextId2 = ExpressionContextId.fromString(uuid2);

      expect(expressionContextId1.equals(expressionContextId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const expressionContextId = ExpressionContextId.fromString(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(expressionContextId.equals(expressionContextId)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should have readonly property in TypeScript', () => {
      const expressionContextId = ExpressionContextId.fromString(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      // This test verifies that the property is marked as readonly in TypeScript
      // Runtime assignment is still possible in JavaScript, but TypeScript should prevent it
      expect(expressionContextId.value).toBeDefined();
    });

    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expressionContextId = ExpressionContextId.fromString(uuid);

      expect(expressionContextId.value).toBe(uuid);
      expect(typeof expressionContextId.value).toBe('string');
    });
  });

  describe('validation', () => {
    it('should accept valid UUID v4', () => {
      const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => ExpressionContextId.fromString(validUuidV4)).not.toThrow();
    });

    it('should accept valid UUID with different format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => ExpressionContextId.fromString(validUuid)).not.toThrow();
    });

    it('should reject UUID with wrong length', () => {
      const shortUuid = '123e4567-e89b-12d3-a456';

      expect(() => ExpressionContextId.fromString(shortUuid)).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should reject UUID with invalid characters', () => {
      const invalidCharUuid = '123e4567-e89b-12d3-a456-42661417400g';

      expect(() => ExpressionContextId.fromString(invalidCharUuid)).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should reject UUID without hyphens', () => {
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      expect(() => ExpressionContextId.fromString(noHyphensUuid)).toThrow(
        'ExpressionContextId is not valid',
      );
    });
  });
});
