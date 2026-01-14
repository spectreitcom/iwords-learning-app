import { LoginCommandHandler } from '../login.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeAccessTokenService } from './fakes/fake-access-token.service';
import { FakeRefreshTokenService } from './fakes/fake-refresh-token.service';
import { FakeRefreshTokenStorage } from './fakes/fake-refresh-token.storage';
import { LoginCommand } from '../../commands/login.command';
import { AdminUser } from '../../../domain/admin-user';
import { AppError } from '../../../../common/errors';
import { randomUUID } from 'crypto';

describe('LoginCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let accessTokenService: FakeAccessTokenService;
  let refreshTokenService: FakeRefreshTokenService;
  let refreshTokenStorage: FakeRefreshTokenStorage;
  let handler: LoginCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    accessTokenService = new FakeAccessTokenService();
    refreshTokenService = new FakeRefreshTokenService();
    refreshTokenStorage = new FakeRefreshTokenStorage();
    handler = new LoginCommandHandler(
      adminUserRepository,
      accessTokenService,
      refreshTokenService,
      refreshTokenStorage,
    );
  });

  it('should login an admin user and return tokens', async () => {
    const adminUser = AdminUser.create(
      'admin@example.com',
      'Admin User',
      'hashed-password',
      true,
    );
    const userId = adminUser.getAdminUserId().value;
    await adminUserRepository.save(adminUser);

    const command = new LoginCommand(userId);
    const result = await handler.execute(command);

    expect(result.accessToken).toBe(`access-token-${userId}`);
    expect(result.refreshToken).toContain(`refresh-token:${userId}:`);
    expect(result.user.adminUserId).toBe(userId);
    expect(result.user.email).toBe('admin@example.com');
    expect(result.user.name).toBe('Admin User');

    const refreshTokenId = result.refreshToken.split(':').pop()!;
    const isValid = await refreshTokenStorage.validate(userId, refreshTokenId);
    expect(isValid).toBe(true);
  });

  it('should throw error if user does not exist', async () => {
    const userId = randomUUID();
    const command = new LoginCommand(userId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('WRONG_CREDENTIALS', 'Wrong credentials'),
    );
  });

  it('should throw error if user is blocked', async () => {
    const adminUser = AdminUser.create(
      'blocked@example.com',
      'Blocked User',
      'hashed-password',
      false,
    );
    adminUser.block();
    const userId = adminUser.getAdminUserId().value;
    await adminUserRepository.save(adminUser);

    const command = new LoginCommand(userId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('WRONG_CREDENTIALS', 'Wrong credentials'),
    );
  });
});
