import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForSentenceCommand } from '../commands/check-answer-for-sentence.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';

export type CheckAnswerForSentenceCommandResponse = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

@CommandHandler(CheckAnswerForSentenceCommand)
export class CheckAnswerForSentenceCommandHandler
  implements
    ICommandHandler<
      CheckAnswerForSentenceCommand,
      CheckAnswerForSentenceCommandResponse
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(
    command: CheckAnswerForSentenceCommand,
  ): Promise<CheckAnswerForSentenceCommandResponse> {
    const { answer, sentenceId } = command;

    return this.prismaService.$transaction(async (prisma) => {
      const answerSentence =
        await this.prismaService.answerSentenceReadModel.findUnique({
          where: { sentenceId },
        });

      if (!answerSentence) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Answer sentence with id ${sentenceId} not found`,
        );
      }

      const correct = answer === answerSentence.content;

      const event: IntegrationEvent<{
        expressionContextId?: string;
        sentenceId?: string;
        correct: boolean;
      }> = new IntegrationEvent(
        'answer.answer-checked',
        {
          correct,
          sentenceId,
        },
        {
          aggregateId: answerSentence.sentenceId,
        },
      );

      await this.outboxService.enqueue(event, prisma);

      return {
        correct,
        userAnswer: answer,
        correctAnswer: answerSentence.content,
      };
    });
  }
}
