import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOneUserRepetitionCommand } from '../commands/delete-one-user-repetition.command';
import { RepetitionRepository } from '../ports/repetition.repository';

@CommandHandler(DeleteOneUserRepetitionCommand)
export class DeleteOneUserRepetitionCommandHandler
  implements ICommandHandler<DeleteOneUserRepetitionCommand, void>
{
  constructor(private readonly repetitionRepository: RepetitionRepository) {}

  async execute(command: DeleteOneUserRepetitionCommand): Promise<void> {
    const { userId, expressionContextId } = command;
    await this.repetitionRepository.deleteOne(userId, expressionContextId);
  }
}
