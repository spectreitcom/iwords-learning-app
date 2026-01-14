import { AddExpressionContextIdCommandHandler } from '../add-expression-context-id.command-handler';
import { FakeBoxRepository } from './fakes/fake-box.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { AddExpressionContextIdCommand } from '../../commands/add-expression-context-id.command';
import { AppError } from '../../../../common/errors';
import { EventPublisher } from '@nestjs/cqrs';
import { Box } from '../../../domain/box';
import { BoxId } from '../../../domain/value-objects/box-id';
import { randomUUID } from 'node:crypto';

describe('AddExpressionContextIdCommandHandler', () => {
  let handler: AddExpressionContextIdCommandHandler;
  let boxRepository: FakeBoxRepository;
  let eventPublisher: FakeEventPublisher;

  beforeEach(() => {
    boxRepository = new FakeBoxRepository();
    eventPublisher = new FakeEventPublisher();
    handler = new AddExpressionContextIdCommandHandler(
      boxRepository as any,
      eventPublisher as unknown as EventPublisher,
    );
  });

  it('should add expression context id to box', async () => {
    // Given
    const boxId = BoxId.create();
    const box = new Box(boxId, 'Some Title', []);
    await boxRepository.save(box);

    const expressionContextId = randomUUID();
    const command = new AddExpressionContextIdCommand(
      boxId.value,
      expressionContextId,
    );

    // When
    await handler.execute(command);

    // Then
    const updatedBox = await boxRepository.findById(boxId.value);
    expect(updatedBox?.getExpressionContextIds()).toHaveLength(1);
    expect(updatedBox?.getExpressionContextIds()[0].value).toBe(
      expressionContextId,
    );
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw AppError when box not found', async () => {
    // Given
    const boxId = randomUUID();
    const expressionContextId = randomUUID();
    const command = new AddExpressionContextIdCommand(
      boxId,
      expressionContextId,
    );

    // When & Then
    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`),
    );
  });

  it('should throw AppError when expression context id already exists', async () => {
    // Given
    const boxId = BoxId.create();
    const expressionContextId = randomUUID();
    const box = new Box(boxId, 'Some Title', []);
    box.addExpressionContextId(expressionContextId);
    await boxRepository.save(box);

    const command = new AddExpressionContextIdCommand(
      boxId.value,
      expressionContextId,
    );

    // When & Then
    await expect(handler.execute(command)).rejects.toThrow(
      new AppError(
        'ALREADY_EXISTS',
        `Expression context id ${expressionContextId} already exists`,
      ),
    );
  });
});
