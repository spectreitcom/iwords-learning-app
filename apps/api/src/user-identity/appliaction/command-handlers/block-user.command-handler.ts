import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlockUserCommand } from '../commands/block-user.command';
import { UserRepository } from '../ports/user.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(BlockUserCommand)
export class BlockUserCommandHandler
  implements ICommandHandler<BlockUserCommand, void>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: BlockUserCommand): Promise<void> {
    const { userToBlockId } = command;

    const user = await this.userRepository.findById(userToBlockId);

    if (!user) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `User with id ${userToBlockId} not found`,
      );
    }

    user.block();
    await this.userRepository.save(user);
  }
}
