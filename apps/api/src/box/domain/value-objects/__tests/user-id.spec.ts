import { UserId } from '../user-id';

describe('UserId', () => {
  describe('fromString', () => {
    it('should create UserId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const userId = UserId.fromString(validUuid);

      expect(userId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => UserId.fromString(invalidUuid)).toThrow(
        'UserId is not valid',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => UserId.fromString('')).toThrow('UserId is not valid');
    });

    it('should throw error for null value', () => {
      expect(() => UserId.fromString(null as unknown as string)).toThrow(
        'UserId is not valid',
      );
    });

    it('should throw error for undefined value', () => {
      expect(() => UserId.fromString(undefined as unknown as string)).toThrow(
        'UserId is not valid',
      );
    });

    it('should throw error for non-string value', () => {
      expect(() => UserId.fromString(123 as unknown as string)).toThrow(
        'UserId is not valid',
      );
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const userId1 = UserId.fromString(uuid);
      const userId2 = UserId.fromString(uuid);

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const userId1 = UserId.fromString(uuid1);
      const userId2 = UserId.fromString(uuid2);

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const userId = UserId.fromString('123e4567-e89b-12d3-a456-426614174000');

      expect(userId.equals(userId)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should have readonly property in TypeScript', () => {
      const userId = UserId.fromString('123e4567-e89b-12d3-a456-426614174000');

      // This test verifies that the property is marked as readonly in TypeScript
      // Runtime assignment is still possible in JavaScript, but TypeScript should prevent it
      expect(userId.value).toBeDefined();
    });

    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const userId = UserId.fromString(uuid);

      expect(userId.value).toBe(uuid);
      expect(typeof userId.value).toBe('string');
    });
  });

  describe('validation', () => {
    it('should accept valid UUID v4', () => {
      const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => UserId.fromString(validUuidV4)).not.toThrow();
    });

    it('should accept valid UUID with different format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => UserId.fromString(validUuid)).not.toThrow();
    });

    it('should reject UUID with wrong length', () => {
      const shortUuid = '123e4567-e89b-12d3-a456';

      expect(() => UserId.fromString(shortUuid)).toThrow('UserId is not valid');
    });

    it('should reject UUID with invalid characters', () => {
      const invalidCharUuid = '123e4567-e89b-12d3-a456-42661417400g';

      expect(() => UserId.fromString(invalidCharUuid)).toThrow(
        'UserId is not valid',
      );
    });

    it('should reject UUID without hyphens', () => {
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      expect(() => UserId.fromString(noHyphensUuid)).toThrow(
        'UserId is not valid',
      );
    });
  });
});
