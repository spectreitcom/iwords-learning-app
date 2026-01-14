import { BlockAdminUserCommandHandler } from '../block-admin-user.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeAdminUserValidationService } from './fakes/fake-admin-user-validation.service';
import { BlockAdminUserCommand } from '../../commands/block-admin-user.command';
import { AdminUser } from '../../../domain/admin-user';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';
import { AdminUserId } from '../../../domain/value-objects/admin-user-id';

describe('BlockAdminUserCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let adminUserValidationService: FakeAdminUserValidationService;
  let handler: BlockAdminUserCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    adminUserValidationService = new FakeAdminUserValidationService();
    handler = new BlockAdminUserCommandHandler(
      adminUserRepository,
      adminUserValidationService,
    );
  });

  it('should block an admin user when requester is a superuser', async () => {
    const adminUserId = randomUUID();
    const userToBlockId = randomUUID();

    adminUserValidationService.setSuperUser(adminUserId);

    const userToBlock = new AdminUser(
      AdminUserId.fromString(userToBlockId),
      null as any, // Email not needed for this test
      'Test User',
      'hashed-password',
      false,
    );
    await adminUserRepository.save(userToBlock);

    const command = new BlockAdminUserCommand(adminUserId, userToBlockId);
    await handler.execute(command);

    const blockedUser = await adminUserRepository.findById(userToBlockId);
    expect(blockedUser?.getBlocked()).toBe(true);
  });

  it('should throw error when requester is not a superuser', async () => {
    const adminUserId = randomUUID();
    const userToBlockId = randomUUID();

    const command = new BlockAdminUserCommand(adminUserId, userToBlockId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('VALIDATION_ERROR', 'Only superuser can block users'),
    );
  });

  it('should throw error when user to block does not exist', async () => {
    const adminUserId = randomUUID();
    const userToBlockId = randomUUID();

    adminUserValidationService.setSuperUser(adminUserId);

    const command = new BlockAdminUserCommand(adminUserId, userToBlockId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${userToBlockId} not found`,
      ),
    );
  });
});
