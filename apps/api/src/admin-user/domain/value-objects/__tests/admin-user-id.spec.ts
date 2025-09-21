import { AdminUserId } from '../admin-user-id';

describe('AdminUserId', () => {
  describe('create', () => {
    it('should create AdminUserId with random UUID', () => {
      const adminUserId = AdminUserId.create();

      expect(adminUserId.value).toBeDefined();
      expect(typeof adminUserId.value).toBe('string');
      expect(adminUserId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should create unique AdminUserIds', () => {
      const adminUserId1 = AdminUserId.create();
      const adminUserId2 = AdminUserId.create();

      expect(adminUserId1.value).not.toBe(adminUserId2.value);
    });

    it('should create AdminUserId with length 36', () => {
      const adminUserId = AdminUserId.create();

      expect(adminUserId.value.length).toBe(36);
    });
  });

  describe('fromString', () => {
    it('should create AdminUserId with valid UUID string', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const adminUserId = AdminUserId.fromString(validUuid);

      expect(adminUserId.value).toBe(validUuid);
    });

    it('should create AdminUserId with uppercase UUID', () => {
      const validUuid = '123E4567-E89B-12D3-A456-426614174000';
      const adminUserId = AdminUserId.fromString(validUuid);

      expect(adminUserId.value).toBe(validUuid);
    });

    it('should create AdminUserId with mixed case UUID', () => {
      const validUuid = '123e4567-E89B-12d3-A456-426614174000';
      const adminUserId = AdminUserId.fromString(validUuid);

      expect(adminUserId.value).toBe(validUuid);
    });

    it('should throw error for invalid UUID format - missing dashes', () => {
      const invalidUuid = '123e4567e89b12d3a456426614174000';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for invalid UUID format - wrong length', () => {
      const invalidUuid = '123e4567-e89b-12d3-a456-42661417400';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for invalid UUID format - invalid characters', () => {
      const invalidUuid = '123g4567-e89b-12d3-a456-426614174000';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for empty string', () => {
      const invalidUuid = '';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for null-like string', () => {
      const invalidUuid = 'null';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for undefined-like string', () => {
      const invalidUuid = 'undefined';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for random string', () => {
      const invalidUuid = 'not-a-uuid-at-all';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for UUID with extra characters', () => {
      const invalidUuid = '123e4567-e89b-12d3-a456-426614174000-extra';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });

    it('should throw error for UUID with spaces', () => {
      const invalidUuid = ' 123e4567-e89b-12d3-a456-426614174000 ';

      expect(() => AdminUserId.fromString(invalidUuid)).toThrow('AdminUserId is not valid');
    });
  });

  describe('equals', () => {
    it('should return true for same UUID values', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const adminUserId1 = AdminUserId.fromString(uuid);
      const adminUserId2 = AdminUserId.fromString(uuid);

      expect(adminUserId1.equals(adminUserId2)).toBe(true);
    });

    it('should return false for different UUID values', () => {
      const adminUserId1 = AdminUserId.fromString('123e4567-e89b-12d3-a456-426614174000');
      const adminUserId2 = AdminUserId.fromString('987f6543-c21a-43e2-b789-537725285111');

      expect(adminUserId1.equals(adminUserId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const adminUserId = AdminUserId.fromString('123e4567-e89b-12d3-a456-426614174000');

      expect(adminUserId.equals(adminUserId)).toBe(true);
    });

    it('should be case sensitive', () => {
      const adminUserId1 = AdminUserId.fromString('123e4567-e89b-12d3-a456-426614174000');
      const adminUserId2 = AdminUserId.fromString('123E4567-E89B-12D3-A456-426614174000');

      expect(adminUserId1.equals(adminUserId2)).toBe(false);
    });

    it('should return true for created AdminUserIds compared with themselves', () => {
      const adminUserId = AdminUserId.create();

      expect(adminUserId.equals(adminUserId)).toBe(true);
    });

    it('should return false for different created AdminUserIds', () => {
      const adminUserId1 = AdminUserId.create();
      const adminUserId2 = AdminUserId.create();

      expect(adminUserId1.equals(adminUserId2)).toBe(false);
    });
  });
});