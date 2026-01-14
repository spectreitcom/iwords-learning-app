import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateSentenceCommand } from '../commands/create-sentence.command';
import { SentenceRepository } from '../ports/sentece.repository';
import { Sentence } from '../../domain/sentence';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(CreateSentenceCommand)
export class CreateSentenceCommandHandler
  implements ICommandHandler<CreateSentenceCommand, void>
{
  constructor(
    private readonly sentenceRepository: SentenceRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(command: CreateSentenceCommand): Promise<void> {
    const { expressionContextId, translation, content } = command;

    await this.transactionRunner.runInTransaction(async (prisma) => {
      const expressionContext = await this.expressionContextRepository.findById(
        expressionContextId,
        prisma,
      );

      if (!expressionContext) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Expression context with id ${expressionContextId} not found.`,
        );
      }

      const sentence = Sentence.create(
        content.toLowerCase(),
        translation.toLowerCase(),
        expressionContextId,
      );
      this.eventPublisher.mergeObjectContext(sentence);
      await this.sentenceRepository.save(sentence, prisma);

      const event: IntegrationEvent<{
        sentenceId: string;
        content: string;
        translation: string;
        expressionContextId: string;
        expressionId: string;
      }> = new IntegrationEvent(
        'dictionary.sentence-created',
        {
          content: sentence.getContent(),
          translation: sentence.getTranslation(),
          sentenceId: sentence.getSentenceId().value,
          expressionContextId: sentence.getExpressionContextId().value,
          expressionId: expressionContext.getExpressionId().value,
        },
        { aggregateId: sentence.getSentenceId().value },
      );

      await this.outboxService.enqueue(event, prisma);

      sentence.commit();
    });
  }
}
