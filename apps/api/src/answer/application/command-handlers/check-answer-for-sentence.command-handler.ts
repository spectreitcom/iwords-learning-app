import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForSentenceCommand } from '../commands/check-answer-for-sentence.command';
import { AppError } from '../../../common/errors';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';
import { AnswerSentenceReadRepository } from '../ports/answer-sentence-read.repository';

export type CheckAnswerForSentenceCommandResponse = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

@CommandHandler(CheckAnswerForSentenceCommand)
export class CheckAnswerForSentenceCommandHandler implements ICommandHandler<
  CheckAnswerForSentenceCommand,
  CheckAnswerForSentenceCommandResponse
> {
  constructor(
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
    private readonly answerSentenceReadRepository: AnswerSentenceReadRepository,
  ) {}

  async execute(
    command: CheckAnswerForSentenceCommand,
  ): Promise<CheckAnswerForSentenceCommandResponse> {
    const { answer, sentenceId, userId } = command;

    return this.transactionRunner.runInTransaction(async (prisma) => {
      const answerSentence =
        await this.answerSentenceReadRepository.findBySentenceId(
          sentenceId,
          prisma,
        );

      if (!answerSentence) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Answer sentence with id ${sentenceId} not found`,
        );
      }

      const correct = answer === answerSentence.content;

      const event: IntegrationEvent<{
        expressionContextId: string;
        sentenceId?: string;
        correct: boolean;
        userId: string;
      }> = new IntegrationEvent(
        'answer.answer-checked',
        {
          expressionContextId: answerSentence.expressionContextId,
          correct,
          sentenceId,
          userId,
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
