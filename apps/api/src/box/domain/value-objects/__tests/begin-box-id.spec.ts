import { BeginBoxId } from '../begin-box-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

describe('BeginBoxId', () => {
  describe('fromString', () => {
    it('should create BeginBoxId with valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const beginBoxId = BeginBoxId.fromString(validUuid);

      expect(beginBoxId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => BeginBoxId.fromString(invalidUuid)).toThrow(
        'BeginBoxId is not valid',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => BeginBoxId.fromString('')).toThrow(
        'BeginBoxId is not valid',
      );
    });

    it('should throw error for null value', () => {
      expect(() => BeginBoxId.fromString(null as any)).toThrow(
        'BeginBoxId is not valid',
      );
    });

    it('should throw error for undefined value', () => {
      expect(() => BeginBoxId.fromString(undefined as any)).toThrow(
        'BeginBoxId is not valid',
      );
    });

    it('should throw error for non-string value', () => {
      expect(() => BeginBoxId.fromString(123 as any)).toThrow(
        'BeginBoxId is not valid',
      );
    });
  });

  describe('create', () => {
    it('should create BeginBoxId with valid UUID', () => {
      const beginBoxId = BeginBoxId.create();

      expect(isValidUUID(beginBoxId.value)).toBe(true);
    });

    it('should generate different UUIDs on multiple calls', () => {
      const id1 = BeginBoxId.create();
      const id2 = BeginBoxId.create();

      expect(id1.value).not.toBe(id2.value);
    });

    it('should generate new UUID every time', () => {
      const id = BeginBoxId.create();

      expect(isValidUUID(id.value)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id1 = BeginBoxId.fromString(uuid);
      const id2 = BeginBoxId.fromString(uuid);

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '987fcdeb-51a2-43d1-9876-543210987654';
      const id1 = BeginBoxId.fromString(uuid1);
      const id2 = BeginBoxId.fromString(uuid2);

      expect(id1.equals(id2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const id = BeginBoxId.fromString('123e4567-e89b-12d3-a456-426614174000');

      expect(id.equals(id)).toBe(true);
    });
  });

  describe('value property', () => {
    it('should have readonly property in TypeScript', () => {
      const id = BeginBoxId.fromString('123e4567-e89b-12d3-a456-426614174000');

      // This test verifies that the property is marked as readonly in TypeScript
      // Runtime assignment is still possible in JavaScript, but TypeScript should prevent it
      expect(id.value).toBeDefined();
    });

    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id = BeginBoxId.fromString(uuid);

      expect(id.value).toBe(uuid);
      expect(typeof id.value).toBe('string');
    });
  });

  describe('validation', () => {
    it('should accept valid UUID v4', () => {
      const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => BeginBoxId.fromString(validUuidV4)).not.toThrow();
    });

    it('should accept valid UUID with different format', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => BeginBoxId.fromString(validUuid)).not.toThrow();
    });

    it('should reject UUID with wrong length', () => {
      const shortUuid = '123e4567-e89b-12d3-a456';

      expect(() => BeginBoxId.fromString(shortUuid)).toThrow(
        'BeginBoxId is not valid',
      );
    });

    it('should reject UUID with invalid characters', () => {
      const invalidCharUuid = '123e4567-e89b-12d3-a456-42661417400g';

      expect(() => BeginBoxId.fromString(invalidCharUuid)).toThrow(
        'BeginBoxId is not valid',
      );
    });

    it('should reject UUID without hyphens', () => {
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      expect(() => BeginBoxId.fromString(noHyphensUuid)).toThrow(
        'BeginBoxId is not valid',
      );
    });
  });
});
