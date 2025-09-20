import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateSentenceCommand } from '../commands/create-sentence.command';
import { SentenceRepository } from '../ports/sentece.repository';
import { ExpressionContextValidationService } from '../ports/expression-context-validation.service';
import { ExpressionContextNotFoundError } from '../errors';
import { Sentence } from '../../domain/sentence';

@CommandHandler(CreateSentenceCommand)
export class CreateSentenceCommandHandler
  implements ICommandHandler<CreateSentenceCommand, void>
{
  constructor(
    private readonly sentenceRepository: SentenceRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionContextValidationService: ExpressionContextValidationService,
  ) {}

  async execute(command: CreateSentenceCommand): Promise<void> {
    const { expressionContextId, translation, content } = command;

    const expressionContextExists =
      await this.expressionContextValidationService.exists(expressionContextId);

    if (!expressionContextExists) {
      throw new ExpressionContextNotFoundError(expressionContextId);
    }

    const sentence = Sentence.create(
      content.toLowerCase(),
      translation.toLowerCase(),
      expressionContextId,
    );
    this.eventPublisher.mergeObjectContext(sentence);
    await this.sentenceRepository.save(sentence);
    sentence.commit();
  }
}
