import { EventPublisher } from '@nestjs/cqrs';
import { UpdateNounExpressionContextCommandHandler } from '../update-noun-expression-context.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { UpdateNounExpressionContextCommand } from '../../commands/update-noun-expression-context.command';
import { ExpressionContext } from '../../../domain/expression-context';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../../domain/value-objects/expression-id';
import { ExpressionType } from '../../../domain/value-objects/expression-type';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';
import { NOUN } from '../../../domain/constants';

describe('UpdateNounExpressionContextCommandHandler', () => {
  let expressionContextRepository: FakeExpressionContextRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: UpdateNounExpressionContextCommandHandler;

  beforeEach(() => {
    expressionContextRepository = new FakeExpressionContextRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new UpdateNounExpressionContextCommandHandler(
      expressionContextRepository,
      eventPublisher,
      outboxService,
      transactionRunner,
    );
  });

  it('should update a noun expression context', async () => {
    const expressionContextId = randomUUID();
    const expressionId = randomUUID();
    const expressionContext = new ExpressionContext(
      ExpressionContextId.fromString(expressionContextId),
      ExpressionId.fromString(expressionId),
      'old translation',
      false,
      ExpressionType.fromString(NOUN),
      null,
      false,
      null,
      null,
    );
    await expressionContextRepository.save(expressionContext);

    const newTranslation = 'New translation';
    const isCountable = true;
    const command = new UpdateNounExpressionContextCommand(
      expressionContextId,
      newTranslation,
      isCountable,
    );

    await handler.execute(command);

    const updatedContext =
      await expressionContextRepository.findById(expressionContextId);
    expect(updatedContext?.getTranslation()).toBe(newTranslation.toLowerCase());
    expect(updatedContext?.getIsCountable()).toBe(isCountable);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-context-updated',
    );
  });

  it('should throw an error if expression context does not exist', async () => {
    const expressionContextId = randomUUID();
    const command = new UpdateNounExpressionContextCommand(
      expressionContextId,
      'new translation',
      true,
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression context with id ${expressionContextId} not found.`,
    );
  });
});
