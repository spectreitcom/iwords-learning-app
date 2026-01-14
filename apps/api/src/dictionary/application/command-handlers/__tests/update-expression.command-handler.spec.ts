import { EventPublisher } from '@nestjs/cqrs';
import { UpdateExpressionCommandHandler } from '../update-expression.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionRepository } from './fakes/fake-expression.repository';
import { FakeExpressionValidationService } from './fakes/fake-expression-validation.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { UpdateExpressionCommand } from '../../commands/update-expression.command';
import { Expression } from '../../../domain/expression';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('UpdateExpressionCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let expressionRepository: FakeExpressionRepository;
  let expressionValidationService: FakeExpressionValidationService;
  let transactionRunner: FakeTransactionRunner;
  let outboxService: FakeOutboxService;
  let handler: UpdateExpressionCommandHandler;

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    expressionRepository = new FakeExpressionRepository();
    expressionValidationService = new FakeExpressionValidationService();
    transactionRunner = new FakeTransactionRunner();
    outboxService = new FakeOutboxService();
    handler = new UpdateExpressionCommandHandler(
      expressionRepository,
      expressionValidationService,
      eventPublisher,
      transactionRunner,
      outboxService,
    );
  });

  it('should update an expression', async () => {
    const expressionId = randomUUID();
    const oldPhrase = 'old phrase';
    const expression = new Expression(expressionId, oldPhrase);
    await expressionRepository.save(expression);

    const newPhrase = 'new phrase';
    const command = new UpdateExpressionCommand(expressionId, newPhrase);

    await handler.execute(command);

    const updatedExpression = await expressionRepository.findById(expressionId);
    expect(updatedExpression?.getPhrase()).toBe(newPhrase.toLowerCase());
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-updated',
    );
  });

  it('should throw an error if expression does not exist', async () => {
    const expressionId = randomUUID();
    const command = new UpdateExpressionCommand(expressionId, 'new phrase');

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression with id ${expressionId} not found.`,
    );
  });

  it('should throw an error if new phrase already exists for another expression', async () => {
    const expressionId = randomUUID();
    const expression = new Expression(expressionId, 'phrase');
    await expressionRepository.save(expression);

    const otherId = randomUUID();
    expressionValidationService.setPhraseCheckResult(otherId);

    const command = new UpdateExpressionCommand(
      expressionId,
      'existing phrase',
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression with phrase existing phrase already exists.`,
    );
  });
});
