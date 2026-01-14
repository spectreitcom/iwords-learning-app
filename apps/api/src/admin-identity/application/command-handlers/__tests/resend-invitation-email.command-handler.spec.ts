import { ResendInvitationEmailCommandHandler } from '../resend-invitation-email.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeResetPasswordTokensStorage } from './fakes/fake-reset-password-tokens.storage';
import { ResendInvitationEmailCommand } from '../../commands/resend-invitation-email.command';
import { AdminUser } from '../../../domain/admin-user';
import { AppError } from '../../../../common/errors';
import { randomUUID } from 'crypto';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';

describe('ResendInvitationEmailCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let outboxService: FakeOutboxService;
  let resetTokensStorage: FakeResetPasswordTokensStorage;
  let transactionRunner: FakeTransactionRunner;
  let handler: ResendInvitationEmailCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    outboxService = new FakeOutboxService();
    resetTokensStorage = new FakeResetPasswordTokensStorage();
    transactionRunner = new FakeTransactionRunner();
    handler = new ResendInvitationEmailCommandHandler(
      adminUserRepository,
      outboxService,
      resetTokensStorage,
      transactionRunner,
    );
  });

  it('should resend invitation email', async () => {
    const adminUser = AdminUser.create(
      'admin@example.com',
      'Admin',
      null,
      false,
    );
    const userId = adminUser.getAdminUserId().value;
    await adminUserRepository.save(adminUser);

    const command = new ResendInvitationEmailCommand(userId);
    await handler.execute(command);

    const updatedUser = await adminUserRepository.findById(userId);
    const newToken = updatedUser?.getResetPasswordToken();
    expect(newToken).toBeTruthy();

    const storedToken = await resetTokensStorage.getToken(userId);
    expect(storedToken).toBe(newToken);

    const enqueuedEvents = outboxService.getEnqueuedEvents();
    expect(enqueuedEvents).toHaveLength(1);
    expect(enqueuedEvents[0].type).toBe('admin-identity.user-invited');
    expect(enqueuedEvents[0].payload.email).toBe('admin@example.com');
    expect(enqueuedEvents[0].payload.resetPasswordToken).toBe(newToken);
  });

  it('should throw error if user not found', async () => {
    const userId = randomUUID();
    const command = new ResendInvitationEmailCommand(userId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${userId} not found`,
      ),
    );
  });
});
