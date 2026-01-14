import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { FakeBoxRepository } from './fakes/fake-box.repository';
import { CreateBoxCommand } from '../../commands/create-box.command';
import { CreateBoxCommandHandler } from '../create-box.command-handler';
import { EventPublisher } from '@nestjs/cqrs';

describe('CreateBoxCommandHandler', () => {
  let boxRepository: FakeBoxRepository;
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let handler: CreateBoxCommandHandler;

  beforeEach(() => {
    boxRepository = new FakeBoxRepository();
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    handler = new CreateBoxCommandHandler(boxRepository, eventPublisher);
  });

  it('should create a box', async () => {
    const title = 'Test Box';
    const command = new CreateBoxCommand(title);
    await handler.execute(command);

    expect(boxRepository.getLength()).toBe(1);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.getTitle()).toBe(title);
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();

    const createdBox = await boxRepository.findById(
      eventPublisher.lastMerged.getBoxId().value,
    );
    expect(createdBox).toBeTruthy();
    expect(createdBox?.getTitle()).toBe(title);
  });
});
