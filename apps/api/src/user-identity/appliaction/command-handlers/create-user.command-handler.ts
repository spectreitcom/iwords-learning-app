import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepository } from '../ports/user.repository';
import { User } from '../../domain/user';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<
  CreateUserCommand,
  void
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { name, email, clerkId } = command;

    const user = User.create(clerkId, email, name);
    await this.userRepository.save(user);
  }
}
