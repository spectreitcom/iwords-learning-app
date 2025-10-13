import { User } from '../user';
import { UserId } from '../value-objects/user-id';
import { UserEmail } from '../value-objects/user-email';

describe('User', () => {
  const mockClerkId = 'clerk_123456789';
  const mockEmail = 'test@example.com';
  const mockName = 'John Doe';
  const mockProvider = 'google';

  describe('constructor', () => {
    it('should create User with all required properties', () => {
      const userId = UserId.create();
      const userEmail = UserEmail.fromString(mockEmail);

      const user = new User(
        userId,
        mockClerkId,
        userEmail,
        mockName,
        false,
        mockProvider,
      );

      expect(user.getUserId()).toBe(userId);
      expect(user.getClerkId()).toBe(mockClerkId);
      expect(user.getEmail()).toBe(userEmail);
      expect(user.getName()).toBe(mockName);
      expect(user.getBlocked()).toBe(false);
      expect(user.getProvider()).toBe(mockProvider);
    });

    it('should create User with blocked status true', () => {
      const userId = UserId.create();
      const userEmail = UserEmail.fromString(mockEmail);

      const user = new User(
        userId,
        mockClerkId,
        userEmail,
        mockName,
        true,
        mockProvider,
      );

      expect(user.getBlocked()).toBe(true);
    });
  });

  describe('create', () => {
    it('should create User with generated UserId and UserEmail from string', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getUserId()).toBeInstanceOf(UserId);
      expect(user.getClerkId()).toBe(mockClerkId);
      expect(user.getEmail()).toBeInstanceOf(UserEmail);
      expect(user.getEmail().value).toBe(mockEmail);
      expect(user.getName()).toBe(mockName);
      expect(user.getBlocked()).toBe(false);
      expect(user.getProvider()).toBe(mockProvider);
    });

    it('should create different users with different UserIds', () => {
      const user1 = User.create(mockClerkId, mockEmail, mockName, mockProvider);
      const user2 = User.create(
        'clerk_987654321',
        'other@example.com',
        'Jane Doe',
        'facebook',
      );

      expect(user1.getUserId().equals(user2.getUserId())).toBe(false);
    });

    it('should create user with default blocked status false', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getBlocked()).toBe(false);
    });

    it('should handle different providers', () => {
      const providers = ['google', 'facebook', 'github', 'email'];

      providers.forEach((provider) => {
        const user = User.create(mockClerkId, mockEmail, mockName, provider);
        expect(user.getProvider()).toBe(provider);
      });
    });

    it('should handle different email formats', () => {
      const validEmails = [
        'simple@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user_123@test-domain.com',
      ];

      validEmails.forEach((email) => {
        const user = User.create(mockClerkId, email, mockName, mockProvider);
        expect(user.getEmail().value).toBe(email);
      });
    });
  });

  describe('block', () => {
    it('should set blocked status to true', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getBlocked()).toBe(false);

      user.block();

      expect(user.getBlocked()).toBe(true);
    });

    it('should remain blocked when called multiple times', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      user.block();
      user.block();

      expect(user.getBlocked()).toBe(true);
    });

    it('should block already blocked user', () => {
      const userId = UserId.create();
      const userEmail = UserEmail.fromString(mockEmail);
      const user = new User(
        userId,
        mockClerkId,
        userEmail,
        mockName,
        true,
        mockProvider,
      );

      user.block();

      expect(user.getBlocked()).toBe(true);
    });
  });

  describe('unblock', () => {
    it('should set blocked status to false', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);
      user.block();

      expect(user.getBlocked()).toBe(true);

      user.unblock();

      expect(user.getBlocked()).toBe(false);
    });

    it('should remain unblocked when called multiple times', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      user.unblock();
      user.unblock();

      expect(user.getBlocked()).toBe(false);
    });

    it('should unblock already unblocked user', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      user.unblock();

      expect(user.getBlocked()).toBe(false);
    });
  });

  describe('getUserId', () => {
    it('should return the same UserId instance', () => {
      const userId = UserId.create();
      const userEmail = UserEmail.fromString(mockEmail);
      const user = new User(
        userId,
        mockClerkId,
        userEmail,
        mockName,
        false,
        mockProvider,
      );

      expect(user.getUserId()).toBe(userId);
    });

    it('should return UserId for created user', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getUserId()).toBeInstanceOf(UserId);
    });
  });

  describe('getClerkId', () => {
    it('should return the clerk ID', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getClerkId()).toBe(mockClerkId);
    });

    it('should handle different clerk ID formats', () => {
      const clerkIds = ['clerk_123', 'user_456789', 'auth0|abc123'];

      clerkIds.forEach((clerkId) => {
        const user = User.create(clerkId, mockEmail, mockName, mockProvider);
        expect(user.getClerkId()).toBe(clerkId);
      });
    });
  });

  describe('getEmail', () => {
    it('should return the same UserEmail instance', () => {
      const userId = UserId.create();
      const userEmail = UserEmail.fromString(mockEmail);
      const user = new User(
        userId,
        mockClerkId,
        userEmail,
        mockName,
        false,
        mockProvider,
      );

      expect(user.getEmail()).toBe(userEmail);
    });

    it('should return UserEmail for created user', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getEmail()).toBeInstanceOf(UserEmail);
      expect(user.getEmail().value).toBe(mockEmail);
    });
  });

  describe('getName', () => {
    it('should return the user name', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getName()).toBe(mockName);
    });

    it('should handle different name formats', () => {
      const names = ['John Doe', 'jane.smith', 'User123', 'María García'];

      names.forEach((name) => {
        const user = User.create(mockClerkId, mockEmail, name, mockProvider);
        expect(user.getName()).toBe(name);
      });
    });
  });

  describe('getBlocked', () => {
    it('should return current blocked status', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getBlocked()).toBe(false);

      user.block();
      expect(user.getBlocked()).toBe(true);

      user.unblock();
      expect(user.getBlocked()).toBe(false);
    });
  });

  describe('getProvider', () => {
    it('should return the authentication provider', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      expect(user.getProvider()).toBe(mockProvider);
    });

    it('should handle different provider names', () => {
      const providers = [
        'google',
        'facebook',
        'github',
        'twitter',
        'email',
        'saml',
      ];

      providers.forEach((provider) => {
        const user = User.create(mockClerkId, mockEmail, mockName, provider);
        expect(user.getProvider()).toBe(provider);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete user lifecycle', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);

      // Initial state
      expect(user.getBlocked()).toBe(false);

      // Block user
      user.block();
      expect(user.getBlocked()).toBe(true);

      // Unblock user
      user.unblock();
      expect(user.getBlocked()).toBe(false);

      // All other properties should remain unchanged
      expect(user.getClerkId()).toBe(mockClerkId);
      expect(user.getEmail().value).toBe(mockEmail);
      expect(user.getName()).toBe(mockName);
      expect(user.getProvider()).toBe(mockProvider);
    });

    it('should maintain immutability of readonly properties', () => {
      const user = User.create(mockClerkId, mockEmail, mockName, mockProvider);
      const initialUserId = user.getUserId();
      const initialEmail = user.getEmail();

      // Block and unblock operations
      user.block();
      user.unblock();

      // Readonly properties should remain the same
      expect(user.getUserId()).toBe(initialUserId);
      expect(user.getEmail()).toBe(initialEmail);
      expect(user.getClerkId()).toBe(mockClerkId);
      expect(user.getName()).toBe(mockName);
      expect(user.getProvider()).toBe(mockProvider);
    });
  });
});
