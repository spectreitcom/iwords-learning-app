import { EventPublisher } from '@nestjs/cqrs';
import { CreateExpressionCommandHandler } from '../create-expression.command-handler';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeExpressionRepository } from './fakes/fake-expression.repository';
import { FakeExpressionValidationService } from './fakes/fake-expression-validation.service';
import { CreateExpressionCommand } from '../../commands/create-expression.command';

describe('CreateExpressionCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let expressionRepository: FakeExpressionRepository;
  let expressionValidationService: FakeExpressionValidationService;
  let handler: CreateExpressionCommandHandler;

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    expressionRepository = new FakeExpressionRepository();
    expressionValidationService = new FakeExpressionValidationService();
    handler = new CreateExpressionCommandHandler(
      eventPublisher,
      expressionRepository,
      expressionValidationService,
    );
  });

  it('should create an expression', async () => {
    const phrase = 'test phrase';
    const command = new CreateExpressionCommand(phrase);

    const result = await handler.execute(command);

    expect(result.expressionId).toBeTruthy();
    expect(result.existingExpressionId).toBeNull();
    expect(expressionRepository.getLength()).toBe(1);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();

    const createdExpression = await expressionRepository.findById(
      result.expressionId!,
    );
    expect(createdExpression).toBeTruthy();
    expect(createdExpression?.getPhrase()).toBe(phrase);
  });

  it('should not create an expression if it already exists', async () => {
    const phrase = 'existing phrase';
    const existingId = 'existing-id';
    expressionValidationService.setPhraseCheckResult(existingId);
    const command = new CreateExpressionCommand(phrase);

    const result = await handler.execute(command);

    expect(result.expressionId).toBeNull();
    expect(result.existingExpressionId).toBe(existingId);
    expect(expressionRepository.getLength()).toBe(0);
  });
});
