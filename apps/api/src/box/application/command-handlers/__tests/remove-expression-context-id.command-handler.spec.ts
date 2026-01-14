import { RemoveExpressionContextIdCommandHandler } from '../remove-expression-context-id.command-handler';
import { FakeBoxRepository } from './fakes/fake-box.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { RemoveExpressionContextIdCommand } from '../../commands/remove-expression-context-id.command';
import { AppError } from '../../../../common/errors';
import { EventPublisher } from '@nestjs/cqrs';
import { Box } from '../../../domain/box';
import { BoxId } from '../../../domain/value-objects/box-id';
import { ExpressionContextId } from '../../../domain/value-objects/expression-context-id';
import { randomUUID } from 'node:crypto';

describe('RemoveExpressionContextIdCommandHandler', () => {
  let handler: RemoveExpressionContextIdCommandHandler;
  let boxRepository: FakeBoxRepository;
  let eventPublisher: FakeEventPublisher;

  beforeEach(() => {
    boxRepository = new FakeBoxRepository();
    eventPublisher = new FakeEventPublisher();
    handler = new RemoveExpressionContextIdCommandHandler(
      boxRepository as any,
      eventPublisher as unknown as EventPublisher,
    );
  });

  it('should remove expression context id from box', async () => {
    // Given
    const boxId = BoxId.create();
    const expressionContextId = randomUUID();
    const otherExpressionContextId = randomUUID();
    const box = new Box(boxId, 'Test Box', [
      ExpressionContextId.fromString(expressionContextId),
      ExpressionContextId.fromString(otherExpressionContextId),
    ]);
    await boxRepository.save(box);

    const command = new RemoveExpressionContextIdCommand(
      boxId.value,
      expressionContextId,
    );

    // When
    await handler.execute(command);

    // Then
    const updatedBox = await boxRepository.findById(boxId.value);
    expect(
      updatedBox?.getExpressionContextIds().map((id) => id.value),
    ).not.toContain(expressionContextId);
    expect(updatedBox?.getExpressionContextIds()).toHaveLength(1);
    expect(
      updatedBox?.getExpressionContextIds().map((id) => id.value),
    ).toContain(otherExpressionContextId);
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw AppError when box not found', async () => {
    // Given
    const boxId = randomUUID();
    const command = new RemoveExpressionContextIdCommand(boxId, randomUUID());

    // When & Then
    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`),
    );
  });
});
