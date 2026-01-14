import { EventPublisher } from '@nestjs/cqrs';
import { DeleteSentenceCommandHandler } from '../delete-sentence.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeSentenceRepository } from './fakes/fake-sentece.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { DeleteSentenceCommand } from '../../commands/delete-sentence.command';
import { Sentence } from '../../../domain/sentence';
import { SentenceId } from '../../../domain/value-objects/sentence-id';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('DeleteSentenceCommandHandler', () => {
  let sentenceRepository: FakeSentenceRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: DeleteSentenceCommandHandler;

  beforeEach(() => {
    sentenceRepository = new FakeSentenceRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new DeleteSentenceCommandHandler(
      sentenceRepository,
      eventPublisher,
      outboxService,
      transactionRunner,
    );
  });

  it('should delete a sentence', async () => {
    const sentenceId = randomUUID();
    const expressionContextId = randomUUID();
    const sentence = new Sentence(
      SentenceId.fromString(sentenceId),
      'content',
      'translation',
      ExpressionContextId.fromString(expressionContextId),
    );
    await sentenceRepository.save(sentence);

    const command = new DeleteSentenceCommand(sentenceId);
    await handler.execute(command);

    expect(sentenceRepository.getLength()).toBe(0);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.sentence-deleted',
    );
  });

  it('should throw an error if sentence does not exist', async () => {
    const sentenceId = randomUUID();
    const command = new DeleteSentenceCommand(sentenceId);

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Sentence with id ${sentenceId} not found.`,
    );
  });
});
