import { RefreshTokenCommandHandler } from '../refresh-token.command-handler';
import { FakeRefreshTokenService } from './fakes/fake-refresh-token.service';
import { FakeAccessTokenService } from './fakes/fake-access-token.service';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeRefreshTokenStorage } from './fakes/fake-refresh-token.storage';
import { RefreshTokenCommand } from '../../commands/refresh-token.command';
import { AdminUser } from '../../../domain/admin-user';
import { AppError } from '../../../../common/errors';

describe('RefreshTokenCommandHandler', () => {
  let refreshTokenService: FakeRefreshTokenService;
  let accessTokenService: FakeAccessTokenService;
  let adminUserRepository: FakeAdminUserRepository;
  let refreshTokenStorage: FakeRefreshTokenStorage;
  let handler: RefreshTokenCommandHandler;

  beforeEach(() => {
    refreshTokenService = new FakeRefreshTokenService();
    accessTokenService = new FakeAccessTokenService();
    adminUserRepository = new FakeAdminUserRepository();
    refreshTokenStorage = new FakeRefreshTokenStorage();
    handler = new RefreshTokenCommandHandler(
      refreshTokenService,
      accessTokenService,
      adminUserRepository,
      refreshTokenStorage,
    );
  });

  it('should refresh tokens', async () => {
    const adminUser = AdminUser.create(
      'admin@example.com',
      'Admin User',
      'hashed-password',
      true,
    );
    const userId = adminUser.getAdminUserId().value;
    await adminUserRepository.save(adminUser);

    const initialRefreshTokenId = 'initial-rt-id';
    const initialRefreshToken = refreshTokenService.createToken(
      userId,
      initialRefreshTokenId,
    );
    await refreshTokenStorage.insert(userId, initialRefreshTokenId);

    const command = new RefreshTokenCommand(initialRefreshToken);
    const result = await handler.execute(command);

    expect(result.accessToken).toBe(`access-token-${userId}`);
    expect(result.refreshToken).toContain(`refresh-token:${userId}:`);
    expect(result.refreshToken).not.toBe(initialRefreshToken);
    expect(result.user.adminUserId).toBe(userId);

    const newRefreshTokenId = result.refreshToken.split(':').pop()!;
    expect(await refreshTokenStorage.validate(userId, newRefreshTokenId)).toBe(
      true,
    );
  });

  it('should throw error if refresh token is invalid', async () => {
    const command = new RefreshTokenCommand('invalid-token');

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('WRONG_CREDENTIALS', 'Wrong refresh token'),
    );
  });

  it('should throw error if refresh token is not in storage', async () => {
    const userId = 'user-id';
    const refreshToken = refreshTokenService.createToken(userId, 'some-id');
    const command = new RefreshTokenCommand(refreshToken);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('WRONG_CREDENTIALS', 'Wrong refresh token'),
    );
  });
});
