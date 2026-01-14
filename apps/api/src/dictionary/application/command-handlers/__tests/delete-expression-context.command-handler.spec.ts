import { EventPublisher } from '@nestjs/cqrs';
import { DeleteExpressionContextCommandHandler } from '../delete-expression-context.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { DeleteExpressionContextCommand } from '../../commands/delete-expression-context.command';
import { ExpressionContext } from '../../../domain/expression-context';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../../domain/value-objects/expression-id';
import { ExpressionType } from '../../../domain/value-objects/expression-type';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('DeleteExpressionContextCommandHandler', () => {
  let expressionContextRepository: FakeExpressionContextRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: DeleteExpressionContextCommandHandler;

  beforeEach(() => {
    expressionContextRepository = new FakeExpressionContextRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new DeleteExpressionContextCommandHandler(
      expressionContextRepository,
      eventPublisher,
      outboxService,
      transactionRunner,
    );
  });

  it('should delete an expression context', async () => {
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

    const command = new DeleteExpressionContextCommand(expressionContextId);
    await handler.execute(command);

    expect(expressionContextRepository.getLength()).toBe(0);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-context-deleted',
    );
  });

  it('should throw an error if expression context does not exist', async () => {
    const expressionContextId = randomUUID();
    const command = new DeleteExpressionContextCommand(expressionContextId);

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression context with id ${expressionContextId} not found.`,
    );
  });
});
