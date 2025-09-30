import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBoxCommand } from '../commands/update-box.command';
import { BoxRepository } from '../ports/box.repository';
import { BoxNotFoundError } from '../errors';

@CommandHandler(UpdateBoxCommand)
export class UpdateBoxCommandHandler
  implements ICommandHandler<UpdateBoxCommand, void>
{
  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateBoxCommand): Promise<void> {
    const { boxId, title } = command;

    const box = await this.boxRepository.findById(boxId);

    if (!box) throw new BoxNotFoundError(boxId);

    this.eventPublisher.mergeObjectContext(box);
    box.update(title);
    await this.boxRepository.save(box);
    box.commit();
  }
}
