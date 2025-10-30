import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAllUserRepetitionsCommand } from '../commands/delete-all-user-repetitions.command';
import { RepetitionRepository } from '../ports/repetition.repository';

@CommandHandler(DeleteAllUserRepetitionsCommand)
export class DeleteAllUserRepetitionsCommandHandler
  implements ICommandHandler<DeleteAllUserRepetitionsCommand, void>
{
  constructor(private readonly repetitionRepository: RepetitionRepository) {}

  async execute(command: DeleteAllUserRepetitionsCommand): Promise<void> {
    await this.repetitionRepository.deleteAllForUser(command.userId);
  }
}
