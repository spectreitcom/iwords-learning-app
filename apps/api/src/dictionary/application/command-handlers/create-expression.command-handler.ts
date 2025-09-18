import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateExpressionCommand } from '../commands/create-expression.command';
import { ExpressionRepository } from '../ports/expression.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { Expression } from '../../domain/expression';

export type CreateExpressionCommandResponse = {
  expressionId: string | null;
  existingExpressionId: string | null;
};

@CommandHandler(CreateExpressionCommand)
export class CreateExpressionCommandHandler
  implements
    ICommandHandler<CreateExpressionCommand, CreateExpressionCommandResponse>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionRepository: ExpressionRepository,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreateExpressionCommand,
  ): Promise<CreateExpressionCommandResponse> {
    const { phrase } = command;

    const existingExpressionId =
      await this.expressionValidationService.checkPhrase(phrase);

    if (existingExpressionId) {
      return {
        expressionId: null,
        existingExpressionId,
      };
    }

    const expression = Expression.create(phrase);
    this.eventPublisher.mergeObjectContext(expression);
    await this.expressionRepository.save(expression);
    expression.commit();

    return {
      expressionId: expression.getExpressionId().value,
      existingExpressionId: null,
    };
  }
}
