import { AdminUserEmail } from '../admin-user-email';

describe('AdminUserEmail', () => {
  describe('fromString', () => {
    it('should create AdminUserEmail with valid email', () => {
      const email = 'admin@example.com';
      const adminUserEmail = AdminUserEmail.fromString(email);

      expect(adminUserEmail.value).toBe(email);
    });

    it('should accept email with subdomain', () => {
      const email = 'admin@subdomain.example.com';
      const adminUserEmail = AdminUserEmail.fromString(email);

      expect(adminUserEmail.value).toBe(email);
    });

    it('should accept email with plus sign', () => {
      const email = 'admin+test@example.com';
      const adminUserEmail = AdminUserEmail.fromString(email);

      expect(adminUserEmail.value).toBe(email);
    });

    it('should accept email with numbers and dots', () => {
      const email = 'admin.user123@example.com';
      const adminUserEmail = AdminUserEmail.fromString(email);

      expect(adminUserEmail.value).toBe(email);
    });

    it('should throw error for invalid email format - missing @', () => {
      const invalidEmail = 'adminexample.com';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for invalid email format - missing domain', () => {
      const invalidEmail = 'admin@';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for invalid email format - missing local part', () => {
      const invalidEmail = '@example.com';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for invalid email format - spaces', () => {
      const invalidEmail = 'admin user@example.com';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for invalid email format - multiple @', () => {
      const invalidEmail = 'admin@@example.com';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for empty string', () => {
      const invalidEmail = '';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for whitespace only', () => {
      const invalidEmail = '   ';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });

    it('should throw error for invalid domain format', () => {
      const invalidEmail = 'admin@.com';

      expect(() => AdminUserEmail.fromString(invalidEmail)).toThrow('Invalid admin user email');
    });
  });

  describe('equals', () => {
    it('should return true for same email values', () => {
      const email = 'admin@example.com';
      const adminUserEmail1 = AdminUserEmail.fromString(email);
      const adminUserEmail2 = AdminUserEmail.fromString(email);

      expect(adminUserEmail1.equals(adminUserEmail2)).toBe(true);
    });

    it('should return false for different email values', () => {
      const adminUserEmail1 = AdminUserEmail.fromString('admin1@example.com');
      const adminUserEmail2 = AdminUserEmail.fromString('admin2@example.com');

      expect(adminUserEmail1.equals(adminUserEmail2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const adminUserEmail = AdminUserEmail.fromString('admin@example.com');

      expect(adminUserEmail.equals(adminUserEmail)).toBe(true);
    });

    it('should be case sensitive', () => {
      const adminUserEmail1 = AdminUserEmail.fromString('admin@example.com');
      const adminUserEmail2 = AdminUserEmail.fromString('Admin@example.com');

      expect(adminUserEmail1.equals(adminUserEmail2)).toBe(false);
    });
  });
});