import { EventPublisher } from '@nestjs/cqrs';
import { UpdateSentenceCommandHandler } from '../update-sentence.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeSentenceRepository } from './fakes/fake-sentece.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { UpdateSentenceCommand } from '../../commands/update-sentence.command';
import { Sentence } from '../../../domain/sentence';
import { SentenceId } from '../../../domain/value-objects/sentence-id';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('UpdateSentenceCommandHandler', () => {
  let sentenceRepository: FakeSentenceRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: UpdateSentenceCommandHandler;

  beforeEach(() => {
    sentenceRepository = new FakeSentenceRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new UpdateSentenceCommandHandler(
      sentenceRepository,
      eventPublisher,
      outboxService,
      transactionRunner,
    );
  });

  it('should update a sentence', async () => {
    const sentenceId = randomUUID();
    const expressionContextId = randomUUID();
    const sentence = new Sentence(
      SentenceId.fromString(sentenceId),
      'old content',
      'old translation',
      ExpressionContextId.fromString(expressionContextId),
    );
    await sentenceRepository.save(sentence);

    const newContent = 'New content';
    const newTranslation = 'Nowe tłumaczenie';
    const command = new UpdateSentenceCommand(
      sentenceId,
      newTranslation,
      newContent,
    );

    await handler.execute(command);

    const updatedSentence = await sentenceRepository.findById(sentenceId);
    expect(updatedSentence?.getContent()).toBe(newContent.toLowerCase());
    expect(updatedSentence?.getTranslation()).toBe(
      newTranslation.toLowerCase(),
    );
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.sentence-updated',
    );
  });

  it('should throw an error if sentence does not exist', async () => {
    const sentenceId = randomUUID();
    const command = new UpdateSentenceCommand(
      sentenceId,
      'translation',
      'content',
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Sentence with id ${sentenceId} not found.`,
    );
  });
});
