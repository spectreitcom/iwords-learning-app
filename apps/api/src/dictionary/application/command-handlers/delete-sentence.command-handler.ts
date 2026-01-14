import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSentenceCommand } from '../commands/delete-sentence.command';
import { SentenceRepository } from '../ports/sentece.repository';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(DeleteSentenceCommand)
export class DeleteSentenceCommandHandler
  implements ICommandHandler<DeleteSentenceCommand, void>
{
  constructor(
    private readonly sentenceRepository: SentenceRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(command: DeleteSentenceCommand): Promise<void> {
    const { sentenceId } = command;

    await this.transactionRunner.runInTransaction(async (prisma) => {
      const sentence = await this.sentenceRepository.findById(
        sentenceId,
        prisma,
      );

      if (!sentence) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Sentence with id ${sentenceId} not found.`,
        );
      }

      this.eventPublisher.mergeObjectContext(sentence);

      sentence.delete();

      await this.sentenceRepository.delete(
        sentence.getSentenceId().value,
        prisma,
      );

      const event: IntegrationEvent<{ sentenceId: string }> =
        new IntegrationEvent(
          'dictionary.sentence-deleted',
          {
            sentenceId,
          },
          {
            aggregateId: sentence.getSentenceId().value,
          },
        );

      await this.outboxService.enqueue(event, prisma);

      sentence.commit();
    });
  }
}
