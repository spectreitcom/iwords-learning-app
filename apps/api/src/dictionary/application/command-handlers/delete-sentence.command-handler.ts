import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSentenceCommand } from '../commands/delete-sentence.command';
import { SentenceRepository } from '../ports/sentece.repository';
import { SentenceNotFoundError } from '../errors';

@CommandHandler(DeleteSentenceCommand)
export class DeleteSentenceCommandHandler
  implements ICommandHandler<DeleteSentenceCommand, void>
{
  constructor(
    private readonly sentenceRepository: SentenceRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteSentenceCommand): Promise<void> {
    const { sentenceId } = command;

    const sentence = await this.sentenceRepository.findById(sentenceId);

    if (!sentence) {
      throw new SentenceNotFoundError(sentenceId);
    }

    this.eventPublisher.mergeObjectContext(sentence);
    sentence.delete();
    await this.sentenceRepository.delete(sentence.getSentenceId().value);
    sentence.commit();
  }
}
