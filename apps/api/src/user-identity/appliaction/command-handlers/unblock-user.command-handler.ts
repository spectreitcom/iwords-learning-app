import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnblockUserCommand } from '../commands/unblock-user.command';
import { UserRepository } from '../ports/user.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(UnblockUserCommand)
export class UnblockUserCommandHandler implements ICommandHandler<
  UnblockUserCommand,
  void
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UnblockUserCommand): Promise<void> {
    const { userToUnblockId } = command;

    const user = await this.userRepository.findById(userToUnblockId);

    if (!user) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `User with id ${userToUnblockId} not found`,
      );
    }

    user.unblock();
    await this.userRepository.save(user);
  }
}
