import { CreateUserCommandHandler } from '../create-user.command-handler';
import { FakeUserRepository } from './fakes/fake-user.repository';
import { CreateUserCommand } from '../../commands/create-user.command';
import { randomUUID } from 'node:crypto';

describe('CreateUserCommandHandler', () => {
  let repository: FakeUserRepository;
  let handler: CreateUserCommandHandler;

  beforeEach(() => {
    repository = new FakeUserRepository();
    handler = new CreateUserCommandHandler(repository);
  });

  it('should create a new user', async () => {
    const command = new CreateUserCommand(
      'test@example.com',
      'Test User',
      'clerk_' + randomUUID(),
    );

    await handler.execute(command);

    const user = await repository.findByClerkId(command.clerkId);
    expect(user).toBeDefined();
    expect(user?.getEmail().value).toBe(command.email);
    expect(user?.getName()).toBe(command.name);
    expect(user?.getClerkId()).toBe(command.clerkId);
    expect(user?.getBlocked()).toBe(false);
  });
});
