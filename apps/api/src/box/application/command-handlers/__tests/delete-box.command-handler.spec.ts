import { DeleteBoxCommandHandler } from '../delete-box.command-handler';
import { EventPublisher } from '@nestjs/cqrs';
import { DeleteBoxCommand } from '../../commands/delete-box.command';
import { randomUUID } from 'node:crypto';
import { FakeBoxRepository } from './fakes/fake-box.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { AppError } from '../../../../common/errors';

describe('DeleteBoxCommandHandler', () => {
  let handler: DeleteBoxCommandHandler;
  let boxRepository: FakeBoxRepository;
  let eventPublisher: EventPublisher & {
    lastMerged?: any;
  };

  const BOX_ID = randomUUID();

  beforeEach(() => {
    boxRepository = new FakeBoxRepository([
      {
        id: BOX_ID,
        title: 'Box Title',
        expressionContextIds: [],
      },
    ]);
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    handler = new DeleteBoxCommandHandler(boxRepository, eventPublisher);
  });

  it('should delete a box', async () => {
    const command = new DeleteBoxCommand(BOX_ID);
    await handler.execute(command);

    expect(boxRepository.getLength()).toBe(0);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw AppError if box does not exist', async () => {
    const boxId = randomUUID();
    const command = new DeleteBoxCommand(boxId);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`),
    );
    expect(boxRepository.getLength()).toBe(1);
  });
});
