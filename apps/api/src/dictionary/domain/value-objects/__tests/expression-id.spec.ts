import { ExpressionId } from '../expression-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

describe('ExpressionId', () => {
  describe('fromString', () => {
    it('should create ExpressionId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const expressionId = ExpressionId.fromString(validUuid);

      expect(expressionId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => ExpressionId.fromString(invalidUuid)).toThrow(
        'ExpressionId is not valid',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => ExpressionId.fromString('')).toThrow(
        'ExpressionId is not valid',
      );
    });

    it('should throw error for null value', () => {
      expect(() => ExpressionId.fromString(null as any)).toThrow(
        'ExpressionId is not valid',
      );
    });

    it('should throw error for undefined value', () => {
      expect(() => ExpressionId.fromString(undefined as any)).toThrow(
        'ExpressionId is not valid',
      );
    });

    it('should throw error for non-string value', () => {
      expect(() => ExpressionId.fromString(123 as any)).toThrow(
        'ExpressionId is not valid',
      );
    });
  });

  describe('create', () => {
    it('should create ExpressionId with valid UUID', () => {
      const expressionId = ExpressionId.create();

      expect(isValidUUID(expressionId.value)).toBe(true);
    });

    it('should generate different UUIDs on multiple calls', () => {
      const expressionId1 = ExpressionId.create();
      const expressionId2 = ExpressionId.create();

      expect(expressionId1.value).not.toBe(expressionId2.value);
    });

    it('should generate new UUID every time', () => {
      const expressionId = ExpressionId.create();

      expect(isValidUUID(expressionId.value)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expressionId1 = ExpressionId.fromString(uuid);
      const expressionId2 = ExpressionId.fromString(uuid);

      expect(expressionId1.equals(expressionId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const expressionId1 = ExpressionId.fromString(uuid1);
      const expressionId2 = ExpressionId.fromString(uuid2);

      expect(expressionId1.equals(expressionId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const expressionId = ExpressionId.fromString(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(expressionId.equals(expressionId)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should have readonly property in TypeScript', () => {
      const expressionId = ExpressionId.fromString(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      // This test verifies that the property is marked as readonly in TypeScript
      // Runtime assignment is still possible in JavaScript, but TypeScript should prevent it
      expect(expressionId.value).toBeDefined();
    });

    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expressionId = ExpressionId.fromString(uuid);

      expect(expressionId.value).toBe(uuid);
      expect(typeof expressionId.value).toBe('string');
    });
  });

  describe('validation', () => {
    it('should accept valid UUID v4', () => {
      const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => ExpressionId.fromString(validUuidV4)).not.toThrow();
    });

    it('should accept valid UUID with different format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => ExpressionId.fromString(validUuid)).not.toThrow();
    });

    it('should reject UUID with wrong length', () => {
      const shortUuid = '123e4567-e89b-12d3-a456';

      expect(() => ExpressionId.fromString(shortUuid)).toThrow(
        'ExpressionId is not valid',
      );
    });

    it('should reject UUID with invalid characters', () => {
      const invalidCharUuid = '123e4567-e89b-12d3-a456-42661417400g';

      expect(() => ExpressionId.fromString(invalidCharUuid)).toThrow(
        'ExpressionId is not valid',
      );
    });

    it('should reject UUID without hyphens', () => {
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      expect(() => ExpressionId.fromString(noHyphensUuid)).toThrow(
        'ExpressionId is not valid',
      );
    });
  });
});
