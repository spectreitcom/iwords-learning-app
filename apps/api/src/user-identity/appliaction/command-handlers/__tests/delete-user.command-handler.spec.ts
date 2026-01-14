import { DeleteUserCommandHandler } from '../delete-user.command-handler';
import { FakeUserRepository } from './fakes/fake-user.repository';
import { DeleteUserCommand } from '../../commands/delete-user.command';
import { User } from '../../../domain/user';
import { AppError } from '../../../../common/errors';
import { randomUUID } from 'crypto';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';

describe('DeleteUserCommandHandler', () => {
  let repository: FakeUserRepository;
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: DeleteUserCommandHandler;

  beforeEach(() => {
    repository = new FakeUserRepository();
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new DeleteUserCommandHandler(
      repository,
      outboxService,
      transactionRunner,
    );
  });

  it('should delete an existing user and enqueue integration event', async () => {
    const clerkId = 'clerk_' + randomUUID();
    const user = User.create(clerkId, 'test@example.com', 'Test User');
    await repository.save(user);
    const userId = user.getUserId().value;

    const command = new DeleteUserCommand(clerkId);
    await handler.execute(command);

    const deletedUser = await repository.findById(userId);
    expect(deletedUser).toBeNull();

    const events = outboxService.getEnqueuedEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('user-identity.user-deleted');
    expect(events[0].payload).toEqual({ userId });
    expect(events[0].meta.aggregateId).toBe(userId);
  });

  it('should throw error if user with clerkId does not exist', async () => {
    const command = new DeleteUserCommand('non-existent');

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow('User not found');
  });
});
