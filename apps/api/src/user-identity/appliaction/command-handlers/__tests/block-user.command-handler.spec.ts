import { BlockUserCommandHandler } from '../block-user.command-handler';
import { FakeUserRepository } from './fakes/fake-user.repository';
import { BlockUserCommand } from '../../commands/block-user.command';
import { User } from '../../../domain/user';
import { AppError } from '../../../../common/errors';
import { randomUUID } from 'crypto';

describe('BlockUserCommandHandler', () => {
  let repository: FakeUserRepository;
  let handler: BlockUserCommandHandler;

  beforeEach(() => {
    repository = new FakeUserRepository();
    handler = new BlockUserCommandHandler(repository);
  });

  it('should block an existing user', async () => {
    const user = User.create(
      'clerk_' + randomUUID(),
      'test@example.com',
      'Test User',
    );
    await repository.save(user);
    const userId = user.getUserId().value;

    const command = new BlockUserCommand(userId);
    await handler.execute(command);

    const updatedUser = await repository.findById(userId);
    expect(updatedUser?.getBlocked()).toBe(true);
  });

  it('should throw error if user does not exist', async () => {
    const command = new BlockUserCommand(randomUUID());

    try {
      await handler.execute(command);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe('ENTITY_NOT_FOUND');
    }
  });
});
