import { ExpressionContextId } from '../expression-context-id';

describe('ExpressionContextId', () => {
  describe('create', () => {
    it('should create a new ExpressionContextId with a valid UUID', () => {
      const id = ExpressionContextId.create();

      expect(id).toBeInstanceOf(ExpressionContextId);
      expect(id.value).toBeDefined();
      expect(id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should create different UUIDs for each call', () => {
      const id1 = ExpressionContextId.create();
      const id2 = ExpressionContextId.create();

      expect(id1.value).not.toBe(id2.value);
    });
  });

  describe('fromString', () => {
    it('should create ExpressionContextId from valid UUID string', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const id = ExpressionContextId.fromString(validUuid);

      expect(id).toBeInstanceOf(ExpressionContextId);
      expect(id.value).toBe(validUuid);
    });

    it('should create ExpressionContextId from valid UUID with uppercase letters', () => {
      const validUuid = '550E8400-E29B-41D4-A716-446655440000';
      const id = ExpressionContextId.fromString(validUuid);

      expect(id).toBeInstanceOf(ExpressionContextId);
      expect(id.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID string', () => {
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

    it('should throw error for UUID with wrong format', () => {
      const invalidUuid = '550e8400-e29b-41d4-a716-44665544000'; // one digit missing

      expect(() => ExpressionContextId.fromString(invalidUuid)).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should throw error for UUID with invalid characters', () => {
      const invalidUuid = '550e8400-e29b-41d4-a716-44665544000g';

      expect(() => ExpressionContextId.fromString(invalidUuid)).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should throw error for null value', () => {
      expect(() => ExpressionContextId.fromString(null as any)).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should throw error for undefined value', () => {
      expect(() => ExpressionContextId.fromString(undefined as any)).toThrow(
        'ExpressionContextId is not valid',
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal ExpressionContextIds', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const id1 = ExpressionContextId.fromString(uuid);
      const id2 = ExpressionContextId.fromString(uuid);

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different ExpressionContextIds', () => {
      const id1 = ExpressionContextId.fromString(
        '550e8400-e29b-41d4-a716-446655440000',
      );
      const id2 = ExpressionContextId.fromString(
        '550e8400-e29b-41d4-a716-446655440001',
      );

      expect(id1.equals(id2)).toBe(false);
    });

    it('should return true when comparing with itself', () => {
      const id = ExpressionContextId.create();

      expect(id.equals(id)).toBe(true);
    });

    it('should be case sensitive', () => {
      const id1 = ExpressionContextId.fromString(
        '550e8400-e29b-41d4-a716-446655440000',
      );
      const id2 = ExpressionContextId.fromString(
        '550E8400-E29B-41D4-A716-446655440000',
      );

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('value property', () => {
    it('should expose the UUID value', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const id = ExpressionContextId.fromString(uuid);

      expect(id.value).toBe(uuid);
    });
  });

  describe('validation', () => {
    it('should validate UUID format during construction', () => {
      expect(() => ExpressionContextId.fromString('invalid-uuid')).toThrow(
        'ExpressionContextId is not valid',
      );
    });

    it('should accept valid UUID v4 format', () => {
      const validUuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

      expect(() => ExpressionContextId.fromString(validUuid)).not.toThrow();
    });

    it('should accept valid UUID v1 format', () => {
      const validUuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

      expect(() => ExpressionContextId.fromString(validUuid)).not.toThrow();
    });
  });
});
