import { EventPublisher } from '@nestjs/cqrs';
import { CreateSentenceCommandHandler } from '../create-sentence.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeSentenceRepository } from './fakes/fake-sentece.repository';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { CreateSentenceCommand } from '../../commands/create-sentence.command';
import { ExpressionContext } from '../../../domain/expression-context';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../../domain/value-objects/expression-id';
import { ExpressionType } from '../../../domain/value-objects/expression-type';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('CreateSentenceCommandHandler', () => {
  let sentenceRepository: FakeSentenceRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let expressionContextRepository: FakeExpressionContextRepository;
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: CreateSentenceCommandHandler;

  beforeEach(() => {
    sentenceRepository = new FakeSentenceRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    expressionContextRepository = new FakeExpressionContextRepository();
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new CreateSentenceCommandHandler(
      sentenceRepository,
      eventPublisher,
      expressionContextRepository,
      outboxService,
      transactionRunner,
    );
  });

  it('should create a sentence', async () => {
    const expressionContextId = randomUUID();
    const expressionId = randomUUID();
    const expressionContext = new ExpressionContext(
      ExpressionContextId.fromString(expressionContextId),
      ExpressionId.fromString(expressionId),
      'translation',
      false,
      ExpressionType.fromString('noun'),
      null,
      false,
      null,
      null,
    );
    await expressionContextRepository.save(expressionContext);

    const content = 'Test sentence';
    const translation = 'Testowe zdanie';
    const command = new CreateSentenceCommand(
      content,
      translation,
      expressionContextId,
    );

    await handler.execute(command);

    expect(sentenceRepository.getLength()).toBe(1);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.getContent()).toBe(content.toLowerCase());
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.sentence-created',
    );
  });

  it('should throw an error if expression context does not exist', async () => {
    const expressionContextId = randomUUID();
    const command = new CreateSentenceCommand(
      'content',
      'translation',
      expressionContextId,
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression context with id ${expressionContextId} not found.`,
    );
  });
});
