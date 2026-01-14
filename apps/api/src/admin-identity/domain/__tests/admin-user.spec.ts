import { AdminUser } from '../admin-user';
import { AdminUserId } from '../value-objects/admin-user-id';
import { AdminUserEmail } from '../value-objects/admin-user-email';

describe('AdminUser', () => {
  const mockAdminUserId = AdminUserId.fromString(
    '550e8400-e29b-41d4-a716-446655440000',
  );
  const mockEmail = AdminUserEmail.fromString('admin@example.com');
  const mockName = 'John Doe';
  const mockHashedPassword = 'hashedPassword123';
  const mockResetToken = 'reset-token-123';

  describe('constructor', () => {
    it('should create an admin user with all properties', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        true,
        false,
        mockResetToken,
      );

      expect(adminUser.getAdminUserId()).toBe(mockAdminUserId);
      expect(adminUser.getEmail()).toBe(mockEmail);
      expect(adminUser.getName()).toBe(mockName);
      expect(adminUser.getHashedPassword()).toBe(mockHashedPassword);
      expect(adminUser.getIsSuperuser()).toBe(true);
      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getResetPasswordToken()).toBe(mockResetToken);
    });

    it('should create an admin user with default blocked status as false', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
      );

      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should create an admin user with null hashed password', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        null,
        false,
        false,
      );

      expect(adminUser.getHashedPassword()).toBeNull();
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should create a blocked admin user', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        true,
      );

      expect(adminUser.getBlocked()).toBe(true);
    });

    it('should create an admin user with reset password token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
        mockResetToken,
      );

      expect(adminUser.getResetPasswordToken()).toBe(mockResetToken);
    });

    it('should create an admin user with default null reset password token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
      );

      expect(adminUser.getResetPasswordToken()).toBeNull();
    });
  });

  describe('create static method', () => {
    it('should create an admin user with generated ID and default values', () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const hashedPassword = 'testPassword';

      const adminUser = AdminUser.create(email, name, hashedPassword, true);

      expect(adminUser.getAdminUserId()).toBeDefined();
      expect(adminUser.getAdminUserId().value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(adminUser.getEmail().value).toBe(email);
      expect(adminUser.getName()).toBe(name);
      expect(adminUser.getHashedPassword()).toBe(hashedPassword);
      expect(adminUser.getIsSuperuser()).toBe(true);
      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should create a regular admin user (not superuser)', () => {
      const email = 'regular@example.com';
      const name = 'Regular User';
      const hashedPassword = 'regularPassword';

      const adminUser = AdminUser.create(email, name, hashedPassword, false);

      expect(adminUser.getIsSuperuser()).toBe(false);
      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should create an admin user with null password', () => {
      const email = 'nopass@example.com';
      const name = 'No Password User';

      const adminUser = AdminUser.create(email, name, null, false);

      expect(adminUser.getHashedPassword()).toBeNull();
      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should create unique admin user IDs', () => {
      const email = 'unique@example.com';
      const name = 'Unique User';
      const hashedPassword = 'uniquePassword';

      const adminUser1 = AdminUser.create(email, name, hashedPassword, true);
      const adminUser2 = AdminUser.create(email, name, hashedPassword, true);

      expect(adminUser1.getAdminUserId().value).not.toBe(
        adminUser2.getAdminUserId().value,
      );
    });
  });

  describe('updateHashedPassword', () => {
    it('should update the hashed password and clear reset password token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
        mockResetToken,
      );

      expect(adminUser.getResetPasswordToken()).toBe(mockResetToken);

      const newHashedPassword = 'newHashedPassword456';
      adminUser.updateHashedPassword(newHashedPassword);

      expect(adminUser.getHashedPassword()).toBe(newHashedPassword);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should update null password to a valid password and clear reset token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        null,
        false,
        false,
        mockResetToken,
      );

      expect(adminUser.getHashedPassword()).toBeNull();
      expect(adminUser.getResetPasswordToken()).toBe(mockResetToken);

      const newHashedPassword = 'firstPassword';
      adminUser.updateHashedPassword(newHashedPassword);

      expect(adminUser.getHashedPassword()).toBe(newHashedPassword);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should update password when no reset token is present', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
        null,
      );

      const newHashedPassword = 'newPassword789';
      adminUser.updateHashedPassword(newHashedPassword);

      expect(adminUser.getHashedPassword()).toBe(newHashedPassword);
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });
  });

  describe('updateResetPasswordToken', () => {
    it('should update the reset password token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
        null,
      );

      expect(adminUser.getResetPasswordToken()).toBeNull();

      const newResetToken = 'new-reset-token-456';
      adminUser.updateResetPasswordToken(newResetToken);

      expect(adminUser.getResetPasswordToken()).toBe(newResetToken);
    });

    it('should replace existing reset password token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
        mockResetToken,
      );

      expect(adminUser.getResetPasswordToken()).toBe(mockResetToken);

      const newResetToken = 'newer-reset-token-789';
      adminUser.updateResetPasswordToken(newResetToken);

      expect(adminUser.getResetPasswordToken()).toBe(newResetToken);
    });

    it('should not affect other properties when updating reset token', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        true,
        true,
        null,
      );

      const originalPassword = adminUser.getHashedPassword();
      const originalBlocked = adminUser.getBlocked();
      const originalSuperuser = adminUser.getIsSuperuser();

      adminUser.updateResetPasswordToken('test-token');

      expect(adminUser.getHashedPassword()).toBe(originalPassword);
      expect(adminUser.getBlocked()).toBe(originalBlocked);
      expect(adminUser.getIsSuperuser()).toBe(originalSuperuser);
      expect(adminUser.getResetPasswordToken()).toBe('test-token');
    });
  });

  describe('block', () => {
    it('should block an unblocked admin user', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
      );

      expect(adminUser.getBlocked()).toBe(false);

      adminUser.block();

      expect(adminUser.getBlocked()).toBe(true);
    });

    it('should keep an already blocked user blocked', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        true,
      );

      expect(adminUser.getBlocked()).toBe(true);

      adminUser.block();

      expect(adminUser.getBlocked()).toBe(true);
    });
  });

  describe('unblock', () => {
    it('should unblock a blocked admin user', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        true,
      );

      expect(adminUser.getBlocked()).toBe(true);

      adminUser.unblock();

      expect(adminUser.getBlocked()).toBe(false);
    });

    it('should keep an already unblocked user unblocked', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
      );

      expect(adminUser.getBlocked()).toBe(false);

      adminUser.unblock();

      expect(adminUser.getBlocked()).toBe(false);
    });
  });

  describe('getters', () => {
    let adminUser: AdminUser;

    beforeEach(() => {
      adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        true,
        false,
        mockResetToken,
      );
    });

    it('should return admin user id', () => {
      expect(adminUser.getAdminUserId()).toBe(mockAdminUserId);
      expect(adminUser.getAdminUserId()).toBeInstanceOf(AdminUserId);
    });

    it('should return email', () => {
      expect(adminUser.getEmail()).toBe(mockEmail);
      expect(adminUser.getEmail()).toBeInstanceOf(AdminUserEmail);
      expect(adminUser.getEmail().value).toBe('admin@example.com');
    });

    it('should return name', () => {
      expect(adminUser.getName()).toBe(mockName);
      expect(typeof adminUser.getName()).toBe('string');
    });

    it('should return hashed password', () => {
      expect(adminUser.getHashedPassword()).toBe(mockHashedPassword);
    });

    it('should return null hashed password', () => {
      const adminUserWithNullPassword = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        null,
        false,
        false,
      );

      expect(adminUserWithNullPassword.getHashedPassword()).toBeNull();
    });

    it('should return is superuser status', () => {
      expect(adminUser.getIsSuperuser()).toBe(true);
      expect(typeof adminUser.getIsSuperuser()).toBe('boolean');
    });

    it('should return blocked status', () => {
      expect(adminUser.getBlocked()).toBe(false);
      expect(typeof adminUser.getBlocked()).toBe('boolean');
    });

    it('should return reset password token', () => {
      expect(adminUser.getResetPasswordToken()).toBe(mockResetToken);
    });

    it('should return null reset password token when not set', () => {
      const adminUserWithoutToken = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        true,
        false,
        null,
      );

      expect(adminUserWithoutToken.getResetPasswordToken()).toBeNull();
    });

    it('should return consistent values across multiple calls', () => {
      const id1 = adminUser.getAdminUserId();
      const id2 = adminUser.getAdminUserId();
      const email1 = adminUser.getEmail();
      const email2 = adminUser.getEmail();

      expect(id1).toBe(id2);
      expect(email1).toBe(email2);
      expect(adminUser.getName()).toBe(adminUser.getName());
      expect(adminUser.getIsSuperuser()).toBe(adminUser.getIsSuperuser());
      expect(adminUser.getBlocked()).toBe(adminUser.getBlocked());
    });
  });

  describe('edge cases and complex scenarios', () => {
    it('should handle empty string name', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        '',
        mockHashedPassword,
        false,
        false,
      );

      expect(adminUser.getName()).toBe('');
    });

    it('should handle multiple password updates with reset tokens', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        'password1',
        false,
        false,
        'initial-token',
      );

      expect(adminUser.getResetPasswordToken()).toBe('initial-token');

      adminUser.updateHashedPassword('password2');
      expect(adminUser.getHashedPassword()).toBe('password2');
      expect(adminUser.getResetPasswordToken()).toBeNull();

      adminUser.updateResetPasswordToken('new-token');
      expect(adminUser.getResetPasswordToken()).toBe('new-token');

      adminUser.updateHashedPassword('password3');
      expect(adminUser.getHashedPassword()).toBe('password3');
      expect(adminUser.getResetPasswordToken()).toBeNull();
    });

    it('should handle multiple reset token updates', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
        null,
      );

      const tokens = ['token1', 'token2', 'token3'];

      tokens.forEach((token) => {
        adminUser.updateResetPasswordToken(token);
        expect(adminUser.getResetPasswordToken()).toBe(token);
      });
    });

    it('should handle multiple block calls', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
      );

      expect(adminUser.getBlocked()).toBe(false);

      adminUser.block();
      expect(adminUser.getBlocked()).toBe(true);

      adminUser.block();
      expect(adminUser.getBlocked()).toBe(true);
    });

    it('should handle multiple unblock calls', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        true,
      );

      expect(adminUser.getBlocked()).toBe(true);

      adminUser.unblock();
      expect(adminUser.getBlocked()).toBe(false);

      adminUser.unblock();
      expect(adminUser.getBlocked()).toBe(false);
    });

    it('should handle alternating block and unblock calls', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
      );

      const operations = [
        { method: 'block', expectedState: true },
        { method: 'unblock', expectedState: false },
        { method: 'block', expectedState: true },
        { method: 'unblock', expectedState: false },
      ];

      operations.forEach(({ method, expectedState }) => {
        if (method === 'block') {
          adminUser.block();
        } else if (method === 'unblock') {
          adminUser.unblock();
        }
        expect(adminUser.getBlocked()).toBe(expectedState);
      });
    });

    it('should maintain state consistency during complex operations', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        'original-password',
        true,
        false,
        'original-token',
      );

      // Verify initial state
      expect(adminUser.getHashedPassword()).toBe('original-password');
      expect(adminUser.getResetPasswordToken()).toBe('original-token');
      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getIsSuperuser()).toBe(true);

      // Block user
      adminUser.block();
      expect(adminUser.getBlocked()).toBe(true);
      expect(adminUser.getHashedPassword()).toBe('original-password');
      expect(adminUser.getResetPasswordToken()).toBe('original-token');

      // Update reset token while blocked
      adminUser.updateResetPasswordToken('new-token');
      expect(adminUser.getResetPasswordToken()).toBe('new-token');
      expect(adminUser.getBlocked()).toBe(true);
      expect(adminUser.getHashedPassword()).toBe('original-password');

      // Update password (should clear token) while blocked
      adminUser.updateHashedPassword('new-password');
      expect(adminUser.getHashedPassword()).toBe('new-password');
      expect(adminUser.getResetPasswordToken()).toBeNull();
      expect(adminUser.getBlocked()).toBe(true);

      // Unblock user
      adminUser.unblock();
      expect(adminUser.getBlocked()).toBe(false);
      expect(adminUser.getHashedPassword()).toBe('new-password');
      expect(adminUser.getResetPasswordToken()).toBeNull();

      // Immutable properties should remain unchanged
      expect(adminUser.getAdminUserId()).toBe(mockAdminUserId);
      expect(adminUser.getEmail()).toBe(mockEmail);
      expect(adminUser.getName()).toBe(mockName);
      expect(adminUser.getIsSuperuser()).toBe(true);
    });

    it('should handle extreme values and special characters', () => {
      const specialName = 'Name with special chars: äöü @#$%^&*()';
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        specialName,
        null,
        false,
        false,
        null,
      );

      expect(adminUser.getName()).toBe(specialName);

      const specialToken = 'token-with-special-chars-123!@#$%';
      adminUser.updateResetPasswordToken(specialToken);
      expect(adminUser.getResetPasswordToken()).toBe(specialToken);
    });
  });
});
