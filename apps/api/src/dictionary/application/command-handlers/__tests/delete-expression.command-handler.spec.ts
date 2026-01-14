import { EventPublisher } from '@nestjs/cqrs';
import { DeleteExpressionCommandHandler } from '../delete-expression.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionRepository } from './fakes/fake-expression.repository';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { DeleteExpressionCommand } from '../../commands/delete-expression.command';
import { Expression } from '../../../domain/expression';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';

describe('DeleteExpressionCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let expressionRepository: FakeExpressionRepository;
  let transactionRunner: FakeTransactionRunner;
  let outboxService: FakeOutboxService;
  let handler: DeleteExpressionCommandHandler;
  let expressionContextRepository: FakeExpressionContextRepository;

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    expressionRepository = new FakeExpressionRepository();
    transactionRunner = new FakeTransactionRunner();
    outboxService = new FakeOutboxService();
    expressionContextRepository = new FakeExpressionContextRepository();

    handler = new DeleteExpressionCommandHandler(
      eventPublisher,
      expressionRepository,
      transactionRunner,
      outboxService,
      expressionContextRepository,
    );
  });

  it('should delete an expression', async () => {
    const expressionId = randomUUID();
    const phrase = 'test phrase';
    const expression = new Expression(expressionId, phrase);
    await expressionRepository.save(expression);

    const command = new DeleteExpressionCommand(expressionId);
    await handler.execute(command);

    expect(expressionRepository.getLength()).toBe(0);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-deleted',
    );
  });

  it('should throw an error if expression does not exist', async () => {
    const expressionId = randomUUID();
    const command = new DeleteExpressionCommand(expressionId);

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression with id ${expressionId} not found.`,
    );
  });
});
