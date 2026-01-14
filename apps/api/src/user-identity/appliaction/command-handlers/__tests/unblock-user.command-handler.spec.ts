import { UnblockUserCommandHandler } from '../unblock-user.command-handler';
import { FakeUserRepository } from './fakes/fake-user.repository';
import { UnblockUserCommand } from '../../commands/unblock-user.command';
import { User } from '../../../domain/user';
import { AppError } from '../../../../common/errors';
import { randomUUID } from 'crypto';

describe('UnblockUserCommandHandler', () => {
  let repository: FakeUserRepository;
  let handler: UnblockUserCommandHandler;

  beforeEach(() => {
    repository = new FakeUserRepository();
    handler = new UnblockUserCommandHandler(repository);
  });

  it('should unblock an existing blocked user', async () => {
    const user = User.create(
      'clerk_' + randomUUID(),
      'test@example.com',
      'Test User',
    );
    user.block();
    await repository.save(user);
    const userId = user.getUserId().value;
    expect(user.getBlocked()).toBe(true);

    const command = new UnblockUserCommand(userId);
    await handler.execute(command);

    const updatedUser = await repository.findById(userId);
    expect(updatedUser?.getBlocked()).toBe(false);
  });

  it('should throw error if user does not exist', async () => {
    const command = new UnblockUserCommand(randomUUID());

    try {
      await handler.execute(command);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe('ENTITY_NOT_FOUND');
    }
  });
});
