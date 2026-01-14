import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSentenceCommand } from '../commands/update-sentence.command';
import { SentenceRepository } from '../ports/sentece.repository';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(UpdateSentenceCommand)
export class UpdateSentenceCommandHandler
  implements ICommandHandler<UpdateSentenceCommand, void>
{
  constructor(
    private readonly sentenceRepository: SentenceRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(command: UpdateSentenceCommand): Promise<void> {
    const { sentenceId, translation, content } = command;

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

      sentence.update(content.toLowerCase(), translation.toLowerCase());
      this.eventPublisher.mergeObjectContext(sentence);

      await this.sentenceRepository.save(sentence, prisma);

      const event: IntegrationEvent<{
        sentenceId: string;
        content: string;
        translation: string;
      }> = new IntegrationEvent(
        'dictionary.sentence-updated',
        {
          content: sentence.getContent(),
          translation: sentence.getTranslation(),
          sentenceId: sentence.getSentenceId().value,
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
