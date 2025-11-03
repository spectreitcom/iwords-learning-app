import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForSimpleTranslationCommand } from '../commands/check-answer-for-simple-translation.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';

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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(
    command: CheckAnswerForSimpleTranslationCommand,
  ): Promise<CheckAnswerForSimpleTranslationCommandResponse> {
    const { answer, expressionContextId, userId } = command;

    return this.prismaService.$transaction(async (prisma) => {
      const answerExpressionContext =
        await prisma.answerExpressionContextReadModel.findUnique({
          where: { expressionContextId },
        });

      if (!answerExpressionContext) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Answer expression context with id ${expressionContextId} not found`,
        );
      }

      const correct = answer === answerExpressionContext.phrase;

      const event: IntegrationEvent<{
        expressionContextId: string;
        sentenceId?: string;
        correct: boolean;
        userId: string;
      }> = new IntegrationEvent(
        'answer.answer-checked',
        {
          correct,
          expressionContextId,
          userId,
        },
        {
          aggregateId: answerExpressionContext.expressionContextId,
        },
      );

      await this.outboxService.enqueue(event, prisma);

      return {
        correct,
        userAnswer: answer,
        correctAnswer: answerExpressionContext.phrase,
      };
    });
  }
}
