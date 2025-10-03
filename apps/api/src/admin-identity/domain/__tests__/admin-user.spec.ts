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

  describe('constructor', () => {
    it('should create an admin user with all properties', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        true,
        false,
      );

      expect(adminUser.getAdminUserId()).toBe(mockAdminUserId);
      expect(adminUser.getEmail()).toBe(mockEmail);
      expect(adminUser.getName()).toBe(mockName);
      expect(adminUser.getHashedPassword()).toBe(mockHashedPassword);
      expect(adminUser.getIsSuperuser()).toBe(true);
      expect(adminUser.getBlocked()).toBe(false);
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
  });

  describe('create static method', () => {
    it('should create an admin user with generated ID and default blocked status', () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const hashedPassword = 'testPassword';

      const adminUser = AdminUser.create(email, name, hashedPassword, true);

      expect(adminUser.getAdminUserId()).toBeDefined();
      expect(adminUser.getEmail().value).toBe(email);
      expect(adminUser.getName()).toBe(name);
      expect(adminUser.getHashedPassword()).toBe(hashedPassword);
      expect(adminUser.getIsSuperuser()).toBe(true);
      expect(adminUser.getBlocked()).toBe(false);
    });

    it('should create a regular admin user (not superuser)', () => {
      const email = 'regular@example.com';
      const name = 'Regular User';
      const hashedPassword = 'regularPassword';

      const adminUser = AdminUser.create(email, name, hashedPassword, false);

      expect(adminUser.getIsSuperuser()).toBe(false);
    });

    it('should create an admin user with null password', () => {
      const email = 'nopass@example.com';
      const name = 'No Password User';

      const adminUser = AdminUser.create(email, name, null, false);

      expect(adminUser.getHashedPassword()).toBeNull();
    });
  });

  describe('updateHashedPassword', () => {
    it('should update the hashed password', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        mockHashedPassword,
        false,
        false,
      );

      const newHashedPassword = 'newHashedPassword456';
      adminUser.updateHashedPassword(newHashedPassword);

      expect(adminUser.getHashedPassword()).toBe(newHashedPassword);
    });

    it('should update null password to a valid password', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        null,
        false,
        false,
      );

      const newHashedPassword = 'firstPassword';
      adminUser.updateHashedPassword(newHashedPassword);

      expect(adminUser.getHashedPassword()).toBe(newHashedPassword);
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
      );
    });

    it('should return admin user id', () => {
      expect(adminUser.getAdminUserId()).toBe(mockAdminUserId);
    });

    it('should return email', () => {
      expect(adminUser.getEmail()).toBe(mockEmail);
    });

    it('should return name', () => {
      expect(adminUser.getName()).toBe(mockName);
    });

    it('should return hashed password', () => {
      expect(adminUser.getHashedPassword()).toBe(mockHashedPassword);
    });

    it('should return is superuser status', () => {
      expect(adminUser.getIsSuperuser()).toBe(true);
    });

    it('should return blocked status', () => {
      expect(adminUser.getBlocked()).toBe(false);
    });
  });

  describe('edge cases', () => {
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

    it('should handle multiple password updates', () => {
      const adminUser = new AdminUser(
        mockAdminUserId,
        mockEmail,
        mockName,
        'password1',
        false,
        false,
      );

      adminUser.updateHashedPassword('password2');
      expect(adminUser.getHashedPassword()).toBe('password2');

      adminUser.updateHashedPassword('password3');
      expect(adminUser.getHashedPassword()).toBe('password3');
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
  });
});
