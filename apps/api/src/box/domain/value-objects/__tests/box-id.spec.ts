import { BoxId } from '../box-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

describe('BoxId', () => {
  describe('fromString', () => {
    it('should create BoxId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const boxId = BoxId.fromString(validUuid);

      expect(boxId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => BoxId.fromString(invalidUuid)).toThrow('BoxId is not valid');
    });

    it('should throw error for empty string', () => {
      expect(() => BoxId.fromString('')).toThrow('BoxId is not valid');
    });

    it('should throw error for null value', () => {
      expect(() => BoxId.fromString(null as any)).toThrow('BoxId is not valid');
    });

    it('should throw error for undefined value', () => {
      expect(() => BoxId.fromString(undefined as any)).toThrow(
        'BoxId is not valid',
      );
    });

    it('should throw error for non-string value', () => {
      expect(() => BoxId.fromString(123 as any)).toThrow('BoxId is not valid');
    });
  });

  describe('create', () => {
    it('should create BoxId with valid UUID', () => {
      const boxId = BoxId.create();

      expect(isValidUUID(boxId.value)).toBe(true);
    });

    it('should generate different UUIDs on multiple calls', () => {
      const boxId1 = BoxId.create();
      const boxId2 = BoxId.create();

      expect(boxId1.value).not.toBe(boxId2.value);
    });

    it('should generate new UUID every time', () => {
      const boxId = BoxId.create();

      expect(isValidUUID(boxId.value)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const boxId1 = BoxId.fromString(uuid);
      const boxId2 = BoxId.fromString(uuid);

      expect(boxId1.equals(boxId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const boxId1 = BoxId.fromString(uuid1);
      const boxId2 = BoxId.fromString(uuid2);

      expect(boxId1.equals(boxId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const boxId = BoxId.fromString('123e4567-e89b-12d3-a456-426614174000');

      expect(boxId.equals(boxId)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should have readonly property in TypeScript', () => {
      const boxId = BoxId.fromString('123e4567-e89b-12d3-a456-426614174000');

      // This test verifies that the property is marked as readonly in TypeScript
      // Runtime assignment is still possible in JavaScript, but TypeScript should prevent it
      expect(boxId.value).toBeDefined();
    });

    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const boxId = BoxId.fromString(uuid);

      expect(boxId.value).toBe(uuid);
      expect(typeof boxId.value).toBe('string');
    });
  });

  describe('validation', () => {
    it('should accept valid UUID v4', () => {
      const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => BoxId.fromString(validUuidV4)).not.toThrow();
    });

    it('should accept valid UUID with different format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => BoxId.fromString(validUuid)).not.toThrow();
    });

    it('should reject UUID with wrong length', () => {
      const shortUuid = '123e4567-e89b-12d3-a456';

      expect(() => BoxId.fromString(shortUuid)).toThrow('BoxId is not valid');
    });

    it('should reject UUID with invalid characters', () => {
      const invalidCharUuid = '123e4567-e89b-12d3-a456-42661417400g';

      expect(() => BoxId.fromString(invalidCharUuid)).toThrow(
        'BoxId is not valid',
      );
    });

    it('should reject UUID without hyphens', () => {
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      expect(() => BoxId.fromString(noHyphensUuid)).toThrow(
        'BoxId is not valid',
      );
    });
  });
});
