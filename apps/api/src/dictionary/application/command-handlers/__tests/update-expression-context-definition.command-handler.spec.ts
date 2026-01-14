import { EventPublisher } from '@nestjs/cqrs';
import { UpdateExpressionContextDefinitionCommandHandler } from '../update-expression-context-definition.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionContextRepository } from './fakes/fake-expression-context.repository';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { UpdateExpressionContextDefinitionCommand } from '../../commands/update-expression-context-definition.command';
import { ExpressionContext } from '../../../domain/expression-context';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../../domain/value-objects/expression-id';
import { ExpressionType } from '../../../domain/value-objects/expression-type';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';
import { NOUN } from '../../../domain/constants';

describe('UpdateExpressionContextDefinitionCommandHandler', () => {
  let expressionContextRepository: FakeExpressionContextRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let outboxService: FakeOutboxService;
  let transactionRunner: FakeTransactionRunner;
  let handler: UpdateExpressionContextDefinitionCommandHandler;

  beforeEach(() => {
    expressionContextRepository = new FakeExpressionContextRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    outboxService = new FakeOutboxService();
    transactionRunner = new FakeTransactionRunner();
    handler = new UpdateExpressionContextDefinitionCommandHandler(
      eventPublisher,
      expressionContextRepository,
      outboxService,
      transactionRunner,
    );
  });

  it('should update an expression context definition', async () => {
    const expressionContextId = randomUUID();
    const expressionId = randomUUID();
    const expressionContext = new ExpressionContext(
      ExpressionContextId.fromString(expressionContextId),
      ExpressionId.fromString(expressionId),
      'translation',
      false,
      ExpressionType.fromString(NOUN),
      null,
      false,
      null,
      null,
    );
    await expressionContextRepository.save(expressionContext);

    const definition = 'New definition';
    const definitionTranslation = 'Nowa definicja';
    const command = new UpdateExpressionContextDefinitionCommand(
      expressionContextId,
      definition,
      definitionTranslation,
    );

    await handler.execute(command);

    const updatedContext =
      await expressionContextRepository.findById(expressionContextId);
    expect(updatedContext?.getDefinition()).toBe(definition);
    expect(updatedContext?.getDefinitionTranslation()).toBe(
      definitionTranslation,
    );
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
    expect(outboxService.getEnqueuedEvents().length).toBe(1);
    expect(outboxService.getEnqueuedEvents()[0].type).toBe(
      'dictionary.expression-context-updated',
    );
  });

  it('should throw an error if expression context does not exist', async () => {
    const expressionContextId = randomUUID();
    const command = new UpdateExpressionContextDefinitionCommand(
      expressionContextId,
      'definition',
      'translation',
    );

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toThrow(
      `Expression context with id ${expressionContextId} not found.`,
    );
  });
});
