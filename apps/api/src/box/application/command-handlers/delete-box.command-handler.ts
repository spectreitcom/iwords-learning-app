import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBoxCommand } from '../commands/delete-box.command';
import { BoxRepository } from '../ports/box.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(DeleteBoxCommand)
export class DeleteBoxCommandHandler
  implements ICommandHandler<DeleteBoxCommand, void>
{
  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteBoxCommand): Promise<void> {
    const { boxId } = command;

    const box = await this.boxRepository.findById(boxId);

    if (!box)
      throw new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`);

    this.eventPublisher.mergeObjectContext(box);
    box.delete();
    await this.boxRepository.delete(boxId);
    box.commit();
  }
}
