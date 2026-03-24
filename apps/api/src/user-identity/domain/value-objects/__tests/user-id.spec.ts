import { UserId } from '../user-id';
import { isUUID } from 'class-validator';

describe('UserId', () => {
  describe('create', () => {
    it('should create UserId with valid UUID', () => {
      const userId = UserId.create();

      expect(userId.value).toBeDefined();
      expect(typeof userId.value).toBe('string');
      expect(isUUID(userId.value)).toBe(true);
    });

    it('should create different UUIDs on multiple calls', () => {
      const userId1 = UserId.create();
      const userId2 = UserId.create();

      expect(userId1.value).not.toBe(userId2.value);
      expect(isUUID(userId1.value)).toBe(true);
      expect(isUUID(userId2.value)).toBe(true);
    });

    it('should create UUID version 4', () => {
      const userId = UserId.create();

      // UUID v4 has format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where y is one of 8, 9, A, or B
      expect(userId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('fromString', () => {
    it('should create UserId with valid UUID string', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
        '00000000-0000-0000-0000-000000000000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ];

      validUUIDs.forEach((uuid) => {
        const userId = UserId.fromString(uuid);
        expect(userId.value).toBe(uuid);
      });
    });

    it('should throw error for invalid UUID formats', () => {
      const invalidUUIDs = [
        '',
        'not-a-uuid',
        '550e8400-e29b-41d4-a716',
        '550e8400-e29b-41d4-a716-44665544000g',
        '550e8400-e29b-41d4-a716-446655440000-extra',
        '550e8400e29b41d4a716446655440000',
        '550e8400-e29b-41d4-a716-44665544000',
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        null,
        undefined,
      ];

      invalidUUIDs.forEach((uuid) => {
        expect(() => UserId.fromString(uuid as string)).toThrow(
          'UserId is not valid',
        );
      });
    });

    it('should accept UUID in different cases', () => {
      const lowerCaseUUID = '550e8400-e29b-41d4-a716-446655440000';
      const upperCaseUUID = '550E8400-E29B-41D4-A716-446655440000';
      const mixedCaseUUID = '550e8400-E29b-41D4-a716-446655440000';

      expect(() => UserId.fromString(lowerCaseUUID)).not.toThrow();
      expect(() => UserId.fromString(upperCaseUUID)).not.toThrow();
      expect(() => UserId.fromString(mixedCaseUUID)).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for identical UUID values', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const userId1 = UserId.fromString(uuid);
      const userId2 = UserId.fromString(uuid);

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const userId1 = UserId.fromString('550e8400-e29b-41d4-a716-446655440000');
      const userId2 = UserId.fromString('6ba7b810-9dad-11d1-80b4-00c04fd430c8');

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const userId = UserId.create();

      expect(userId.equals(userId)).toBe(true);
    });

    it('should be case sensitive for UUID comparison', () => {
      const lowerCaseUUID = '550e8400-e29b-41d4-a716-446655440000';
      const upperCaseUUID = '550E8400-E29B-41D4-A716-446655440000';

      const userId1 = UserId.fromString(lowerCaseUUID);
      const userId2 = UserId.fromString(upperCaseUUID);

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return false for created vs fromString with different UUIDs', () => {
      const createdUserId = UserId.create();
      const stringUserId = UserId.fromString(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(createdUserId.equals(stringUserId)).toBe(false);
    });
  });

  describe('value property', () => {
    it('should be readonly and contain the UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const userId = UserId.fromString(uuid);

      expect(userId.value).toBe(uuid);

      // TypeScript should prevent this, but we can't test compilation errors in runtime
      // The property should be readonly according to the class definition
    });

    it('should preserve original case for fromString', () => {
      const mixedCaseUUID = '550e8400-E29b-41D4-a716-446655440000';
      const userId = UserId.fromString(mixedCaseUUID);

      expect(userId.value).toBe(mixedCaseUUID);
    });
  });
});
