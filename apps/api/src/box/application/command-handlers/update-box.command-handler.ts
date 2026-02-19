import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBoxCommand } from '../commands/update-box.command';
import { BoxRepository } from '../ports/box.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdateBoxCommand)
export class UpdateBoxCommandHandler implements ICommandHandler<
  UpdateBoxCommand,
  void
> {
  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateBoxCommand): Promise<void> {
    const { boxId, title } = command;

    const box = await this.boxRepository.findById(boxId);

    if (!box)
      throw new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`);

    this.eventPublisher.mergeObjectContext(box);
    box.update(title);
    await this.boxRepository.save(box);
    box.commit();
  }
}
