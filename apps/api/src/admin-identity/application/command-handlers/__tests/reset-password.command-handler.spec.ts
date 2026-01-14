import { ResetPasswordCommandHandler } from '../reset-password.command-handler';
import { FakeHashingService } from './fakes/fake-hashing.service';
import { FakeResetPasswordTokensStorage } from './fakes/fake-reset-password-tokens.storage';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { ResetPasswordCommand } from '../../commands/reset-password.command';
import { AdminUser } from '../../../domain/admin-user';
import { AppError } from '../../../../common/errors';

describe('ResetPasswordCommandHandler', () => {
  let hashingService: FakeHashingService;
  let resetPasswordTokensStorage: FakeResetPasswordTokensStorage;
  let adminUserRepository: FakeAdminUserRepository;
  let handler: ResetPasswordCommandHandler;

  beforeEach(() => {
    hashingService = new FakeHashingService();
    resetPasswordTokensStorage = new FakeResetPasswordTokensStorage();
    adminUserRepository = new FakeAdminUserRepository();
    handler = new ResetPasswordCommandHandler(
      hashingService,
      resetPasswordTokensStorage,
      adminUserRepository,
    );
  });

  it('should reset password', async () => {
    const email = 'admin@example.com';
    const token = 'reset-token';
    const adminUser = AdminUser.create(email, 'Admin', 'old-hash', true);
    adminUser.updateResetPasswordToken(token);
    await adminUserRepository.save(adminUser);
    await resetPasswordTokensStorage.insert(
      adminUser.getAdminUserId().value,
      token,
    );

    const newPassword = 'new-password';
    const command = new ResetPasswordCommand(newPassword, token);
    await handler.execute(command);

    const updatedUser = await adminUserRepository.findById(
      adminUser.getAdminUserId().value,
    );
    expect(updatedUser?.getHashedPassword()).toBe(`hashed-${newPassword}`);
    expect(updatedUser?.getResetPasswordToken()).toBeNull();
  });

  it('should throw error if token is invalid (user not found)', async () => {
    const command = new ResetPasswordCommand('new-password', 'invalid-token');

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('UNAUTHORIZED', 'Wrong reset password token'),
    );
  });

  it('should throw error if token is not in storage', async () => {
    const email = 'admin@example.com';
    const token = 'reset-token';
    const adminUser = AdminUser.create(email, 'Admin', 'old-hash', true);
    adminUser.updateResetPasswordToken(token);
    await adminUserRepository.save(adminUser);
    // Not inserting into storage

    const command = new ResetPasswordCommand('new-password', token);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('UNAUTHORIZED', 'Wrong reset password token'),
    );
  });
});
