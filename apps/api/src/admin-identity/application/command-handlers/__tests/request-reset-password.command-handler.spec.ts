import { RequestResetPasswordCommandHandler } from '../request-reset-password.command-handler';
import { FakeResetPasswordTokensStorage } from './fakes/fake-reset-password-tokens.storage';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeTransactionRunner } from '../../../../common/prisma/fake-transaction-runner';
import { RequestResetPasswordCommand } from '../../commands/request-reset-password.command';
import { AdminUser } from '../../../domain/admin-user';
import { AppError } from '../../../../common/errors';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';

describe('RequestResetPasswordCommandHandler', () => {
  let outboxService: FakeOutboxService;
  let resetTokensStorage: FakeResetPasswordTokensStorage;
  let adminUserRepository: FakeAdminUserRepository;
  let transactionRunner: FakeTransactionRunner;
  let handler: RequestResetPasswordCommandHandler;

  beforeEach(() => {
    outboxService = new FakeOutboxService();
    resetTokensStorage = new FakeResetPasswordTokensStorage();
    adminUserRepository = new FakeAdminUserRepository();
    transactionRunner = new FakeTransactionRunner();
    handler = new RequestResetPasswordCommandHandler(
      outboxService,
      resetTokensStorage,
      adminUserRepository,
      transactionRunner,
    );
  });

  it('should request reset password', async () => {
    const email = 'admin@example.com';
    const adminUser = AdminUser.create(email, 'Admin', 'hashed', true);
    await adminUserRepository.save(adminUser);

    const command = new RequestResetPasswordCommand(email);
    await handler.execute(command);

    const updatedUser = await adminUserRepository.findByEmail(email);
    const token = updatedUser?.getResetPasswordToken();
    expect(token).toBeTruthy();

    const storedToken = await resetTokensStorage.getToken(
      adminUser.getAdminUserId().value,
    );
    expect(storedToken).toBe(token);

    const enqueuedEvents = outboxService.getEnqueuedEvents();
    expect(enqueuedEvents).toHaveLength(1);
    expect(enqueuedEvents[0].type).toBe(
      'admin-identity.requested-reset-password',
    );
    expect(enqueuedEvents[0].payload.resetPasswordToken).toBe(token);
    expect(enqueuedEvents[0].payload.email).toBe(email);
  });

  it('should throw error if user not found', async () => {
    const command = new RequestResetPasswordCommand('nonexistent@example.com');

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        'Admin user with email nonexistent@example.com not found',
      ),
    );
  });
});
