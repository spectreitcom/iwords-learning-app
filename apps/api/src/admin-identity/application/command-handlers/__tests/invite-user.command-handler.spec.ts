import { InviteUserCommandHandler } from '../invite-user.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeAdminUserValidationService } from './fakes/fake-admin-user-validation.service';
import { FakeResetPasswordTokensStorage } from './fakes/fake-reset-password-tokens.storage';
import { FakeTransactionRunner } from '../../../../common/prisma/fake-transaction-runner';
import { InviteUserCommand } from '../../commands/invite-user.command';
import { AppError } from '../../../../common/errors';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';

describe('InviteUserCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let adminUserValidationService: FakeAdminUserValidationService;
  let resetPasswordTokensStorage: FakeResetPasswordTokensStorage;
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: InviteUserCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    adminUserValidationService = new FakeAdminUserValidationService();
    resetPasswordTokensStorage = new FakeResetPasswordTokensStorage();
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new InviteUserCommandHandler(
      adminUserRepository,
      resetPasswordTokensStorage,
      outboxService,
      adminUserValidationService,
      transactionRunner,
    );
  });

  it('should invite a new admin user', async () => {
    const email = 'new@example.com';
    const name = 'New User';
    const command = new InviteUserCommand(email, name);

    await handler.execute(command);

    const createdUser = await adminUserRepository.findByEmail(email);
    expect(createdUser).toBeTruthy();
    expect(createdUser?.getName()).toBe(name);
    expect(createdUser?.getEmail().value).toBe(email);
    expect(createdUser?.getIsSuperuser()).toBe(false);

    const token = await resetPasswordTokensStorage.getToken(
      createdUser!.getAdminUserId().value,
    );
    expect(token).toBeTruthy();
    expect(createdUser?.getResetPasswordToken()).toBe(token);

    const enqueuedEvents = outboxService.getEnqueuedEvents();
    expect(enqueuedEvents).toHaveLength(1);
    expect(enqueuedEvents[0].type).toBe('admin-identity.user-invited');
    expect(enqueuedEvents[0].payload.email).toBe(email);
    expect(enqueuedEvents[0].payload.resetPasswordToken).toBe(token);
  });

  it('should throw error if email is already taken', async () => {
    const email = 'taken@example.com';
    const name = 'New User';
    adminUserValidationService.setEmailTaken(email);
    const command = new InviteUserCommand(email, name);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ALREADY_EXISTS',
        `Admin user with email ${email} is already taken`,
      ),
    );
  });
});
