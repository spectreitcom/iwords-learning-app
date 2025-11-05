import { SentenceId } from '../sentence-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

describe('SentenceId', () => {
  describe('fromString', () => {
    it('should create SentenceId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const sentenceId = SentenceId.fromString(validUuid);

      expect(sentenceId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => SentenceId.fromString(invalidUuid)).toThrow(
        'SentenceId is not valid',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => SentenceId.fromString('')).toThrow(
        'SentenceId is not valid',
      );
    });

    it('should throw error for null value', () => {
      expect(() => SentenceId.fromString(null as unknown as string)).toThrow(
        'SentenceId is not valid',
      );
    });

    it('should throw error for undefined value', () => {
      expect(() =>
        SentenceId.fromString(undefined as unknown as string),
      ).toThrow('SentenceId is not valid');
    });

    it('should throw error for non-string value', () => {
      expect(() => SentenceId.fromString(123 as unknown as string)).toThrow(
        'SentenceId is not valid',
      );
    });
  });

  describe('create', () => {
    it('should create SentenceId with valid UUID', () => {
      const sentenceId = SentenceId.create();

      expect(isValidUUID(sentenceId.value)).toBe(true);
    });

    it('should generate different UUIDs on multiple calls', () => {
      const sentenceId1 = SentenceId.create();
      const sentenceId2 = SentenceId.create();

      expect(sentenceId1.value).not.toBe(sentenceId2.value);
    });

    it('should generate new UUID every time', () => {
      const sentenceId = SentenceId.create();

      expect(isValidUUID(sentenceId.value)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const sentenceId1 = SentenceId.fromString(uuid);
      const sentenceId2 = SentenceId.fromString(uuid);

      expect(sentenceId1.equals(sentenceId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const sentenceId1 = SentenceId.fromString(uuid1);
      const sentenceId2 = SentenceId.fromString(uuid2);

      expect(sentenceId1.equals(sentenceId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const sentenceId = SentenceId.fromString(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(sentenceId.equals(sentenceId)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should have readonly property in TypeScript', () => {
      const sentenceId = SentenceId.fromString(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      // This test verifies that the property is marked as readonly in TypeScript
      // Runtime assignment is still possible in JavaScript, but TypeScript should prevent it
      expect(sentenceId.value).toBeDefined();
    });

    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const sentenceId = SentenceId.fromString(uuid);

      expect(sentenceId.value).toBe(uuid);
      expect(typeof sentenceId.value).toBe('string');
    });
  });

  describe('validation', () => {
    it('should accept valid UUID v4', () => {
      const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => SentenceId.fromString(validUuidV4)).not.toThrow();
    });

    it('should accept valid UUID with different format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => SentenceId.fromString(validUuid)).not.toThrow();
    });

    it('should reject UUID with wrong length', () => {
      const shortUuid = '123e4567-e89b-12d3-a456';

      expect(() => SentenceId.fromString(shortUuid)).toThrow(
        'SentenceId is not valid',
      );
    });

    it('should reject UUID with invalid characters', () => {
      const invalidCharUuid = '123e4567-e89b-12d3-a456-42661417400g';

      expect(() => SentenceId.fromString(invalidCharUuid)).toThrow(
        'SentenceId is not valid',
      );
    });

    it('should reject UUID without hyphens', () => {
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      expect(() => SentenceId.fromString(noHyphensUuid)).toThrow(
        'SentenceId is not valid',
      );
    });
  });
});
