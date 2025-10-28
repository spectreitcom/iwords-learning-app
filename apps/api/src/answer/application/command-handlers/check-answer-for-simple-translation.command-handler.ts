import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForSimpleTranslationCommand } from '../commands/check-answer-for-simple-translation.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

export type CheckAnswerForSimpleTranslationCommandResponse = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

@CommandHandler(CheckAnswerForSimpleTranslationCommand)
export class CheckAnswerForSimpleTranslationCommandHandler
  implements
    ICommandHandler<
      CheckAnswerForSimpleTranslationCommand,
      CheckAnswerForSimpleTranslationCommandResponse
    >
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    command: CheckAnswerForSimpleTranslationCommand,
  ): Promise<CheckAnswerForSimpleTranslationCommandResponse> {
    const { answer, expressionContextId } = command;

    const answerExpressionContext =
      await this.prismaService.answerExpressionContextReadModel.findUnique({
        where: { expressionContextId },
      });

    if (!answerExpressionContext) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Answer expression context with id ${expressionContextId} not found`,
      );
    }

    return {
      correct: answer === answerExpressionContext.phrase,
      userAnswer: answer,
      correctAnswer: answerExpressionContext.phrase,
    };
  }
}
