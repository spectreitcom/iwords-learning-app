import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckAnswerForSimpleTranslationCommand } from '../commands/check-answer-for-simple-translation.command';
import { AppError } from '../../../common/errors';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';
import { AnswerExpressionContextReadRepository } from '../ports/answer-expression-context-read.repository';

export type CheckAnswerForSimpleTranslationCommandResponse = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

@CommandHandler(CheckAnswerForSimpleTranslationCommand)
export class CheckAnswerForSimpleTranslationCommandHandler implements ICommandHandler<
  CheckAnswerForSimpleTranslationCommand,
  CheckAnswerForSimpleTranslationCommandResponse
> {
  constructor(
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
    private readonly answerExpressionContextReadRepository: AnswerExpressionContextReadRepository,
  ) {}

  async execute(
    command: CheckAnswerForSimpleTranslationCommand,
  ): Promise<CheckAnswerForSimpleTranslationCommandResponse> {
    const { answer, expressionContextId, userId } = command;

    return this.transactionRunner.runInTransaction(async (prisma) => {
      const answerExpressionContext =
        await this.answerExpressionContextReadRepository.findByExpressionContextId(
          expressionContextId,
          prisma,
        );

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
