import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSentenceCommand } from '../commands/update-sentence.command';
import { SentenceRepository } from '../ports/sentece.repository';
import { SentenceNotFoundError } from '../errors';

@CommandHandler(UpdateSentenceCommand)
export class UpdateSentenceCommandHandler
  implements ICommandHandler<UpdateSentenceCommand, void>
{
  constructor(
    private readonly sentenceRepository: SentenceRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateSentenceCommand): Promise<void> {
    const { sentenceId, translation, content } = command;

    const sentence = await this.sentenceRepository.findById(sentenceId);

    if (!sentence) {
      throw new SentenceNotFoundError(sentenceId);
    }

    sentence.update(content.toLowerCase(), translation.toLowerCase());
    this.eventPublisher.mergeObjectContext(sentence);
    await this.sentenceRepository.save(sentence);
    sentence.commit();
  }
}
