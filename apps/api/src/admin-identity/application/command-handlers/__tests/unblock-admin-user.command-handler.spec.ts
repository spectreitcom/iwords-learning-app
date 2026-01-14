import { UnblockAdminUserCommandHandler } from '../unblock-admin-user.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeAdminUserValidationService } from './fakes/fake-admin-user-validation.service';
import { UnblockAdminUserCommand } from '../../commands/unblock-admin-user.command';
import { AdminUser } from '../../../domain/admin-user';
import { randomUUID } from 'crypto';
import { AppError } from '../../../../common/errors';

describe('UnblockAdminUserCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let adminUserValidationService: FakeAdminUserValidationService;
  let handler: UnblockAdminUserCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    adminUserValidationService = new FakeAdminUserValidationService();
    handler = new UnblockAdminUserCommandHandler(
      adminUserRepository,
      adminUserValidationService,
    );
  });

  it('should unblock an admin user when requester is a superuser', async () => {
    const adminUserId = randomUUID();
    const userToUnblockId = randomUUID();

    adminUserValidationService.setSuperUser(adminUserId);

    const userToUnblock = AdminUser.create(
      'test@example.com',
      'Test User',
      'hashed-password',
      false,
    );
    // Overwrite the ID to match userToUnblockId
    Object.defineProperty(userToUnblock, 'adminUserId', {
      value: { value: userToUnblockId },
    });
    userToUnblock.block();
    await adminUserRepository.save(userToUnblock);

    const command = new UnblockAdminUserCommand(adminUserId, userToUnblockId);
    await handler.execute(command);

    const unblockedUser = await adminUserRepository.findById(userToUnblockId);
    expect(unblockedUser?.getBlocked()).toBe(false);
  });

  it('should throw error when requester is not a superuser', async () => {
    const adminUserId = randomUUID();
    const userToUnblockId = randomUUID();

    const command = new UnblockAdminUserCommand(adminUserId, userToUnblockId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('VALIDATION_ERROR', 'Only superuser can unblock users'),
    );
  });

  it('should throw error when user to unblock does not exist', async () => {
    const adminUserId = randomUUID();
    const userToUnblockId = randomUUID();

    adminUserValidationService.setSuperUser(adminUserId);

    const command = new UnblockAdminUserCommand(adminUserId, userToUnblockId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${userToUnblockId} not found`,
      ),
    );
  });
});
