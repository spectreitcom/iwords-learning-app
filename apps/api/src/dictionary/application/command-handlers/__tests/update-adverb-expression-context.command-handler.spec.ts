import { EventPublisher } from '@nestjs/cqrs';
import { UpdateAdverbExpressionContextCommandHandler } from '../update-adverb-expression-context.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { UpdateAdverbExpressionContextCommand } from '../../commands/update-adverb-expression-context.command';
import { ExpressionContext } from '../../../domain/expression-context';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../../domain/value-objects/expression-id';
import { ExpressionType } from '../../../domain/value-objects/expression-type';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';
import { ADVERB } from '../../../domain/constants';

describe('UpdateAdverbExpressionContextCommandHandler', () => {
  let expressionContextRepository: FakeExpressionContextRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: UpdateAdverbExpressionContextCommandHandler;

  beforeEach(() => {
    expressionContextRepository = new FakeExpressionContextRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new UpdateAdverbExpressionContextCommandHandler(
      expressionContextRepository,
      eventPublisher,
      outboxService,
      transactionRunner,
    );
  });

  it('should update an adverb expression context', async () => {
    const expressionContextId = randomUUID();
    const expressionId = randomUUID();
    const expressionContext = new ExpressionContext(
      ExpressionContextId.fromString(expressionContextId),
      ExpressionId.fromString(expressionId),
      'old translation',
      false,
      ExpressionType.fromString(ADVERB),
      null,
      false,
      null,
      null,
    );
    await expressionContextRepository.save(expressionContext);

    const newTranslation = 'New translation';
    const command = new UpdateAdverbExpressionContextCommand(
      expressionContextId,
      newTranslation,
    );

    await handler.execute(command);

    const updatedContext =
      await expressionContextRepository.findById(expressionContextId);
    expect(updatedContext?.getTranslation()).toBe(newTranslation.toLowerCase());
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-context-updated',
    );
  });

  it('should throw an error if expression context does not exist', async () => {
    const expressionContextId = randomUUID();
    const command = new UpdateAdverbExpressionContextCommand(
      expressionContextId,
      'new translation',
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression context with id ${expressionContextId} not found.`,
    );
  });
});
