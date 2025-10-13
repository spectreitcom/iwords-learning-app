import { UserEmail } from '../user-email';

describe('UserEmail', () => {
  describe('fromString', () => {
    it('should create UserEmail with valid email', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user_123@test-domain.com',
        'a@b.co',
      ];

      validEmails.forEach((email) => {
        const userEmail = UserEmail.fromString(email);
        expect(userEmail.value).toBe(email);
      });
    });

    it('should throw error for invalid email formats', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@example',
        'user name@example.com',
        'user@example..com',
        null,
        undefined,
      ];

      invalidEmails.forEach((email) => {
        expect(() => UserEmail.fromString(email as string)).toThrow(
          'Invalid user email',
        );
      });
    });

    it('should throw error for very long email addresses', () => {
      const longLocalPart = 'a'.repeat(65);
      const longDomain = 'b'.repeat(250);
      const longEmail = `${longLocalPart}@${longDomain}.com`;

      expect(() => UserEmail.fromString(longEmail)).toThrow(
        'Invalid user email',
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical email values', () => {
      const email1 = UserEmail.fromString('test@example.com');
      const email2 = UserEmail.fromString('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different email values', () => {
      const email1 = UserEmail.fromString('test1@example.com');
      const email2 = UserEmail.fromString('test2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const email = UserEmail.fromString('test@example.com');

      expect(email.equals(email)).toBe(true);
    });

    it('should be case sensitive', () => {
      const email1 = UserEmail.fromString('Test@Example.Com');
      const email2 = UserEmail.fromString('test@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('value property', () => {
    it('should be readonly and contain the original email', () => {
      const emailString = 'readonly@test.com';
      const userEmail = UserEmail.fromString(emailString);

      expect(userEmail.value).toBe(emailString);

      // TypeScript should prevent this, but we can't test compilation errors in runtime
      // The property should be readonly according to the class definition
    });
  });
});
