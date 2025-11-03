import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForIrregularVerbCommand } from '../commands/check-answer-for-irregular-verb.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';

export type CheckAnswerForIrregularVerbCommandResponse = {
  form1: { correct: boolean; userAnswer: string; correctAnswer: string };
  form2: { correct: boolean; userAnswer: string; correctAnswer: string };
  form3: { correct: boolean; userAnswer: string; correctAnswer: string };
  allCorrect: boolean;
};

@CommandHandler(CheckAnswerForIrregularVerbCommand)
export class CheckAnswerForIrregularVerbCommandHandler
  implements
    ICommandHandler<
      CheckAnswerForIrregularVerbCommand,
      CheckAnswerForIrregularVerbCommandResponse
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(
    command: CheckAnswerForIrregularVerbCommand,
  ): Promise<CheckAnswerForIrregularVerbCommandResponse> {
    const { answer, expressionContextId, userId } = command;

    return this.prismaService.$transaction(async (prisma) => {
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

      const { forms } = answerExpressionContext;

      const form1 = forms[0];
      const form2 = forms[1];
      const form3 = forms[2];

      const allCorrect =
        form1 === answer[0] && form2 === answer[1] && form3 === answer[2];

      const event: IntegrationEvent<{
        expressionContextId: string;
        sentenceId?: string;
        correct: boolean;
        userId: string;
      }> = new IntegrationEvent(
        'answer.answer-checked',
        {
          correct: allCorrect,
          expressionContextId,
          userId,
        },
        {
          aggregateId: answerExpressionContext.expressionContextId,
        },
      );

      await this.outboxService.enqueue(event, prisma);

      return {
        form1: {
          correct: form1 === answer[0],
          userAnswer: answer[0],
          correctAnswer: form1,
        },
        form2: {
          correct: form2 === answer[1],
          userAnswer: answer[1],
          correctAnswer: form2,
        },
        form3: {
          correct: form3 === answer[2],
          userAnswer: answer[2],
          correctAnswer: form3,
        },
        allCorrect,
      };
    });
  }
}
