import { ChangePasswordCommandHandler } from '../change-password.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeHashingService } from './fakes/fake-hashing.service';
import { ChangePasswordCommand } from '../../commands/change-password.command';
import { AdminUser } from '../../../domain/admin-user';
import { AdminUserId } from '../../../domain/value-objects/admin-user-id';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('ChangePasswordCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let hashingService: FakeHashingService;
  let handler: ChangePasswordCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    hashingService = new FakeHashingService();
    handler = new ChangePasswordCommandHandler(
      adminUserRepository,
      hashingService,
    );
  });

  it('should change admin user password', async () => {
    const adminUserId = randomUUID();
    const existingPassword = 'old-password';
    const newPassword = 'new-password';
    const hashedOldPassword = await hashingService.hash(existingPassword);

    const adminUser = new AdminUser(
      AdminUserId.fromString(adminUserId),
      null as any,
      'Test User',
      hashedOldPassword,
      false,
    );
    await adminUserRepository.save(adminUser);

    const command = new ChangePasswordCommand(
      existingPassword,
      newPassword,
      adminUserId,
    );
    await handler.execute(command);

    const updatedUser = await adminUserRepository.findById(adminUserId);
    expect(updatedUser?.getHashedPassword()).toBe(`hashed-${newPassword}`);
  });

  it('should throw error when admin user does not exist', async () => {
    const adminUserId = randomUUID();
    const command = new ChangePasswordCommand(
      'old-pass',
      'new-pass',
      adminUserId,
    );

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${adminUserId} not found`,
      ),
    );
  });

  it('should throw error when existing password is wrong', async () => {
    const adminUserId = randomUUID();
    const existingPassword = 'old-password';
    const hashedOldPassword = await hashingService.hash(existingPassword);

    const adminUser = new AdminUser(
      AdminUserId.fromString(adminUserId),
      null as any,
      'Test User',
      hashedOldPassword,
      false,
    );
    await adminUserRepository.save(adminUser);

    const command = new ChangePasswordCommand(
      'wrong-pass',
      'new-pass',
      adminUserId,
    );

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('VALIDATION_ERROR', 'Wrong existing password'),
    );
  });
});
