import { randomUUID } from 'node:crypto';
import { BeginBoxCommandHandler } from '../begin-box.command-handler';
import { FakeBeginBoxRepository } from './fakes/fake-begin-box.repository';
import { BeginBoxCommand } from '../../commands/begin-box.command';

describe('BeginBoxCommandHandler', () => {
  it('should create BeginBox when it does not exist', async () => {
    const fakeBeginBoxRepository = new FakeBeginBoxRepository();
    const handler = new BeginBoxCommandHandler(fakeBeginBoxRepository);

    const userId = randomUUID();
    const boxId = randomUUID();
    const command = new BeginBoxCommand(boxId, userId);

    await handler.execute(command);

    expect(fakeBeginBoxRepository.getLength()).toBe(1);
    const exists = await fakeBeginBoxRepository.exists(userId, boxId);
    expect(exists).toBe(true);
  });

  it('should not create BeginBox when it already exists', async () => {
    const fakeBeginBoxRepository = new FakeBeginBoxRepository();
    const handler = new BeginBoxCommandHandler(fakeBeginBoxRepository);

    const userId = randomUUID();
    const boxId = randomUUID();
    const command = new BeginBoxCommand(boxId, userId);

    // First execution
    await handler.execute(command);
    expect(fakeBeginBoxRepository.getLength()).toBe(1);

    // Second execution
    await handler.execute(command);
    expect(fakeBeginBoxRepository.getLength()).toBe(1);
  });
});
