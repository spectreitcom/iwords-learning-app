import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateNounExpressionContextCommand } from '../commands/create-noun-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionContext } from '../../domain/expression-context';
import { AppError } from '../../../common/errors';

export type CreateNounExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateNounExpressionContextCommand)
export class CreateNounExpressionContextCommandHandler
  implements
    ICommandHandler<
      CreateNounExpressionContextCommand,
      CreateNounExpressionContextCommandResponse
    >
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreateNounExpressionContextCommand,
  ): Promise<CreateNounExpressionContextCommandResponse> {
    const { expressionId, translation, isCountable } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression with id ${expressionId} not found.`,
      );
    }

    const expressionContext = ExpressionContext.createNoun(
      translation.toLowerCase(),
      expressionId,
      isCountable,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();

    return { id: expressionContext.getExpressionContextId().value };
  }
}
