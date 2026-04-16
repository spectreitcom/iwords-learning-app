import { AddExpressionContextToRepetitionCommand } from '../commands/add-expression-context-to-repetition.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepetitionRepository } from '../ports/repetition.repository';
import { Repetition } from '../../domain/repetition';
import { Clock } from '../../../common/clock/clock';

@CommandHandler(AddExpressionContextToRepetitionCommand)
export class AddExpressionContextToRepetitionCommandHandler implements ICommandHandler<
  AddExpressionContextToRepetitionCommand,
  void
> {
  constructor(
    private readonly repetitionRepository: RepetitionRepository,
    private readonly clock: Clock,
  ) {}

  async execute(
    command: AddExpressionContextToRepetitionCommand,
  ): Promise<void> {
    const { userId, expressionContextId } = command;

    const nextRepetitionDate = this.clock.addDaysFromNow(1);

    const repetition = Repetition.create(
      userId,
      expressionContextId,
      nextRepetitionDate,
    );
    await this.repetitionRepository.save(repetition);
  }
}
