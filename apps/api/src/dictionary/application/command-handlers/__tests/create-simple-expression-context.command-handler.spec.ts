import { EventPublisher } from '@nestjs/cqrs';
import { CreateSimpleExpressionContextCommandHandler } from '../create-simple-expression-context.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';
import { FakeExpressionRepository } from './fakes/fake-expression.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { CreateSimpleExpressionContextCommand } from '../../commands/create-simple-expression-context.command';
import { Expression } from '../../../domain/expression';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('CreateSimpleExpressionContextCommandHandler', () => {
  let expressionContextRepository: FakeExpressionContextRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let expressionRepository: FakeExpressionRepository;
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: CreateSimpleExpressionContextCommandHandler;

  beforeEach(() => {
    expressionContextRepository = new FakeExpressionContextRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    expressionRepository = new FakeExpressionRepository();
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new CreateSimpleExpressionContextCommandHandler(
      expressionContextRepository,
      eventPublisher,
      expressionRepository,
      outboxService,
      transactionRunner,
    );
  });

  it('should create a simple expression context', async () => {
    const expressionId = randomUUID();
    const phrase = 'test phrase';
    const expression = new Expression(expressionId, phrase);
    await expressionRepository.save(expression);

    const translation = 'Tłumaczenie';
    const command = new CreateSimpleExpressionContextCommand(
      expressionId,
      translation,
    );

    const result = await handler.execute(command);

    expect(result.id).toBeTruthy();
    expect(expressionContextRepository.getLength()).toBe(1);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.getTranslation()).toBe(
      translation.toLowerCase(),
    );
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-context-created',
    );
  });

  it('should throw an error if expression does not exist', async () => {
    const expressionId = randomUUID();
    const command = new CreateSimpleExpressionContextCommand(
      expressionId,
      'translation',
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression with id ${expressionId} not found.`,
    );
  });
});
