import { UpdateBoxCommandHandler } from '../update-box.command-handler';
import { FakeBoxRepository } from './fakes/fake-box.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { UpdateBoxCommand } from '../../commands/update-box.command';
import { AppError } from '../../../../common/errors';
import { EventPublisher } from '@nestjs/cqrs';
import { Box } from '../../../domain/box';
import { BoxId } from '../../../domain/value-objects/box-id';
import { randomUUID } from 'node:crypto';

describe('UpdateBoxCommandHandler', () => {
  let handler: UpdateBoxCommandHandler;
  let boxRepository: FakeBoxRepository;
  let eventPublisher: FakeEventPublisher;

  beforeEach(() => {
    boxRepository = new FakeBoxRepository();
    eventPublisher = new FakeEventPublisher();
    handler = new UpdateBoxCommandHandler(
      boxRepository as any,
      eventPublisher as unknown as EventPublisher,
    );
  });

  it('should update box title', async () => {
    // Given
    const boxId = BoxId.create();
    const box = new Box(boxId, 'Old Title', []);
    await boxRepository.save(box);

    const newTitle = 'New Title';
    const command = new UpdateBoxCommand(boxId.value, newTitle);

    // When
    await handler.execute(command);

    // Then
    const updatedBox = await boxRepository.findById(boxId.value);
    expect(updatedBox?.getTitle()).toBe(newTitle);
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw AppError when box not found', async () => {
    // Given
    const boxId = randomUUID();
    const command = new UpdateBoxCommand(boxId, 'Some Title');

    // When & Then
    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`),
    );
  });
});
