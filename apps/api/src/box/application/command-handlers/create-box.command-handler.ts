import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateBoxCommand } from '../commands/create-box.command';
import { BoxRepository } from '../ports/box.repository';
import { Box } from '../../domain/box';

@CommandHandler(CreateBoxCommand)
export class CreateBoxCommandHandler
  implements ICommandHandler<CreateBoxCommand, void>
{
  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateBoxCommand): Promise<void> {
    const { title } = command;

    const box = Box.create(title);
    this.eventPublisher.mergeObjectContext(box);
    await this.boxRepository.save(box);
    box.commit();
  }
}
