import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BeginBoxCommand } from '../commands/begin-box.command';
import { BeginBoxRepository } from '../ports/begin-box.repository';
import { BeginBox } from '../../domain/begin-box';

@CommandHandler(BeginBoxCommand)
export class BeginBoxCommandHandler
  implements ICommandHandler<BeginBoxCommand, void>
{
  constructor(private readonly beginBoxRepository: BeginBoxRepository) {}

  async execute(command: BeginBoxCommand): Promise<void> {
    const { userId, boxId } = command;

    const exists = await this.beginBoxRepository.exists(userId, boxId);

    if (exists) return;

    const beginBox = BeginBox.create(userId, boxId);
    await this.beginBoxRepository.save(beginBox);
  }
}
