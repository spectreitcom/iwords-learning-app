import { AdminUser } from '../admin-user';
import { AdminUserId } from '../value-objects/admin-user-id';
import { AdminUserEmail } from '../value-objects/admin-user-email';

describe('AdminUser', () => {
  describe('constructor', () => {
    it('should create AdminUser with all required properties', () => {
      const adminUserId = AdminUserId.create();
      const email = AdminUserEmail.fromString('admin@example.com');
      const name = 'Admin User';
      const hashedPassword = 'hashed_password_123';
      const isSuperuser = true;

      const adminUser = new AdminUser(
        adminUserId,
        email,
        name,
        hashedPassword,
        isSuperuser,
      );

      expect(adminUser.getAdminUserId()).toBe(adminUserId);
      expect(adminUser.getEmail()).toBe(email);
      expect(adminUser.getName()).toBe(name);
      expect(adminUser.getHashedPassword()).toBe(hashedPassword);
      expect(adminUser.getIsSuperuser()).toBe(isSuperuser);
    });

    it('should create AdminUser with null hashed password', () => {
      const adminUserId = AdminUserId.create();
      const email = AdminUserEmail.fromString('admin@example.com');
      const name = 'Admin User';
      const hashedPassword = null;
      const isSuperuser = false;

      const adminUser = new AdminUser(
        adminUserId,
        email,
        name,
        hashedPassword,
        isSuperuser,
      );

      expect(adminUser.getHashedPassword()).toBeNull();
      expect(adminUser.getIsSuperuser()).toBe(false);
    });
  });

  describe('create', () => {
    it('should create AdminUser with valid parameters', () => {
      const email = 'admin@example.com';
      const name = 'Admin User';
      const hashedPassword = 'hashed_password_123';
      const isSuperuser = true;

      const adminUser = AdminUser.create(
        email,
        name,
        hashedPassword,
        isSuperuser,
      );

      expect(adminUser.getAdminUserId()).toBeInstanceOf(AdminUserId);
      expect(adminUser.getEmail()).toBeInstanceOf(AdminUserEmail);
      expect(adminUser.getEmail().value).toBe(email);
      expect(adminUser.getName()).toBe(name);
      expect(adminUser.getHashedPassword()).toBe(hashedPassword);
      expect(adminUser.getIsSuperuser()).toBe(isSuperuser);
    });

    it('should create AdminUser with null hashed password', () => {
      const email = 'admin@example.com';
      const name = 'Admin User';
      const hashedPassword = null;
      const isSuperuser = false;

      const adminUser = AdminUser.create(
        email,
        name,
        hashedPassword,
        isSuperuser,
      );

      expect(adminUser.getHashedPassword()).toBeNull();
      expect(adminUser.getIsSuperuser()).toBe(false);
    });

    it('should create AdminUser as non-superuser by default', () => {
      const email = 'regular@example.com';
      const name = 'Regular Admin';
      const hashedPassword = 'hashed_password_123';
      const isSuperuser = false;

      const adminUser = AdminUser.create(
        email,
        name,
        hashedPassword,
        isSuperuser,
      );

      expect(adminUser.getIsSuperuser()).toBe(false);
    });

    it('should throw error when creating with invalid email', () => {
      const invalidEmail = 'invalid-email';
      const name = 'Admin User';
      const hashedPassword = 'hashed_password_123';
      const isSuperuser = true;

      expect(() => {
        AdminUser.create(invalidEmail, name, hashedPassword, isSuperuser);
      }).toThrow('Invalid admin user email');
    });

    it('should create different AdminUserIds for different instances', () => {
      const email = 'admin@example.com';
      const name = 'Admin User';
      const hashedPassword = 'hashed_password_123';
      const isSuperuser = true;

      const adminUser1 = AdminUser.create(
        email,
        name,
        hashedPassword,
        isSuperuser,
      );
      const adminUser2 = AdminUser.create(
        email,
        name,
        hashedPassword,
        isSuperuser,
      );

      expect(
        adminUser1.getAdminUserId().equals(adminUser2.getAdminUserId()),
      ).toBe(false);
    });
  });

  describe('updateHashedPassword', () => {
    let adminUser: AdminUser;

    beforeEach(() => {
      adminUser = AdminUser.create(
        'admin@example.com',
        'Admin User',
        'old_hashed_password',
        true,
      );
    });

    it('should update hashed password', () => {
      const newHashedPassword = 'new_hashed_password_123';

      adminUser.updateHashedPassword(newHashedPassword);

      expect(adminUser.getHashedPassword()).toBe(newHashedPassword);
    });

    it('should update hashed password from null', () => {
      const adminUserWithNullPassword = AdminUser.create(
        'admin@example.com',
        'Admin User',
        null,
        true,
      );
      const newHashedPassword = 'new_hashed_password_123';

      adminUserWithNullPassword.updateHashedPassword(newHashedPassword);

      expect(adminUserWithNullPassword.getHashedPassword()).toBe(
        newHashedPassword,
      );
    });

    it('should allow updating password multiple times', () => {
      const firstPassword = 'first_password';
      const secondPassword = 'second_password';

      adminUser.updateHashedPassword(firstPassword);
      expect(adminUser.getHashedPassword()).toBe(firstPassword);

      adminUser.updateHashedPassword(secondPassword);
      expect(adminUser.getHashedPassword()).toBe(secondPassword);
    });
  });

  describe('getters', () => {
    let adminUser: AdminUser;
    let adminUserId: AdminUserId;
    let email: AdminUserEmail;

    beforeEach(() => {
      adminUserId = AdminUserId.create();
      email = AdminUserEmail.fromString('test@example.com');
      adminUser = new AdminUser(
        adminUserId,
        email,
        'Test User',
        'test_hashed_password',
        true,
      );
    });

    describe('getAdminUserId', () => {
      it('should return the same AdminUserId instance', () => {
        expect(adminUser.getAdminUserId()).toBe(adminUserId);
      });
    });

    describe('getEmail', () => {
      it('should return the same AdminUserEmail instance', () => {
        expect(adminUser.getEmail()).toBe(email);
      });
    });

    describe('getName', () => {
      it('should return the name', () => {
        expect(adminUser.getName()).toBe('Test User');
      });
    });

    describe('getHashedPassword', () => {
      it('should return the hashed password', () => {
        expect(adminUser.getHashedPassword()).toBe('test_hashed_password');
      });

      it('should return null when hashed password is null', () => {
        const userWithNullPassword = new AdminUser(
          adminUserId,
          email,
          'Test User',
          null,
          false,
        );

        expect(userWithNullPassword.getHashedPassword()).toBeNull();
      });
    });

    describe('getIsSuperuser', () => {
      it('should return true for superuser', () => {
        expect(adminUser.getIsSuperuser()).toBe(true);
      });

      it('should return false for non-superuser', () => {
        const regularUser = new AdminUser(
          adminUserId,
          email,
          'Regular User',
          'password',
          false,
        );

        expect(regularUser.getIsSuperuser()).toBe(false);
      });
    });
  });

  describe('edge cases and data integrity', () => {
    it('should handle empty name', () => {
      const adminUser = AdminUser.create(
        'admin@example.com',
        '',
        'hashed_password',
        false,
      );

      expect(adminUser.getName()).toBe('');
    });

    it('should handle name with special characters', () => {
      const specialName = 'Ádmin Üser-123 @special!';
      const adminUser = AdminUser.create(
        'admin@example.com',
        specialName,
        'hashed_password',
        false,
      );

      expect(adminUser.getName()).toBe(specialName);
    });

    it('should handle very long hashed password', () => {
      const longHashedPassword = 'a'.repeat(1000);
      const adminUser = AdminUser.create(
        'admin@example.com',
        'Admin User',
        longHashedPassword,
        false,
      );

      expect(adminUser.getHashedPassword()).toBe(longHashedPassword);
    });

    it('should maintain immutability of readonly properties', () => {
      const adminUser = AdminUser.create(
        'admin@example.com',
        'Admin User',
        'hashed_password',
        true,
      );

      const originalId = adminUser.getAdminUserId();
      const originalEmail = adminUser.getEmail();
      const originalName = adminUser.getName();
      const originalIsSuperuser = adminUser.getIsSuperuser();

      // These should remain the same after password update
      adminUser.updateHashedPassword('new_password');

      expect(adminUser.getAdminUserId()).toBe(originalId);
      expect(adminUser.getEmail()).toBe(originalEmail);
      expect(adminUser.getName()).toBe(originalName);
      expect(adminUser.getIsSuperuser()).toBe(originalIsSuperuser);
    });
  });
});
