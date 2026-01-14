import { FakeDailyLearnedBoxRepository } from './fakes/fake-daily-learned-box.repository';
import { DailyLearnedBox } from '../../../domain/daily-learned-box';
import { Clock } from '../../../../common/clock/clock';
import { MarkBoxAsFinishedCommandHandler } from '../mark-box-as-finished.command-handler';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { MarkBoxAsFinishedCommand } from '../../commands/mark-box-as-finished.command';
import { randomUUID } from 'node:crypto';

describe('MarkBoxAsFinishedCommandHandler', () => {
  let handler: MarkBoxAsFinishedCommandHandler;
  let dailyLearnedBoxRepository: FakeDailyLearnedBoxRepository;
  let transactionRunner: FakeTransactionRunner;
  let outboxService: FakeOutboxService;
  let clock: Clock;

  beforeEach(() => {
    clock = {
      today: jest.fn().mockReturnValue(new Date('2024-01-01T00:00:00.000Z')),
      now: jest.fn(),
      addDaysFromNow: jest.fn(),
      subtractDaysFromNow: jest.fn(),
      addMillisecondsFromNow: jest.fn(),
    } as unknown as Clock;

    dailyLearnedBoxRepository = new FakeDailyLearnedBoxRepository(clock);
    transactionRunner = new FakeTransactionRunner();
    outboxService = new FakeOutboxService();

    handler = new MarkBoxAsFinishedCommandHandler(
      outboxService,
      transactionRunner,
      dailyLearnedBoxRepository,
    );
  });

  it('should create new DailyLearnedBox and enqueue event when not finished today', async () => {
    // Given
    const boxId = randomUUID();
    const userId = randomUUID();
    const command = new MarkBoxAsFinishedCommand(boxId, userId);

    // When
    await handler.execute(command);

    // Then
    const savedBox = await dailyLearnedBoxRepository.findForToday(
      boxId,
      userId,
    );
    expect(savedBox).toBeDefined();
    expect(savedBox?.getBoxId().value).toBe(boxId);
    expect(savedBox?.getUserId().value).toBe(userId);
    expect(outboxService.getLength()).toBe(1);
  });

  it('should use existing DailyLearnedBox and enqueue event when already finished today', async () => {
    // Given
    const boxId = randomUUID();
    const userId = randomUUID();
    const existingBox = DailyLearnedBox.create(userId, boxId);
    await dailyLearnedBoxRepository.save(existingBox);

    const command = new MarkBoxAsFinishedCommand(boxId, userId);

    // When
    await handler.execute(command);

    // Then
    const savedBox = await dailyLearnedBoxRepository.findForToday(
      boxId,
      userId,
    );
    expect(savedBox).toBeDefined();
    expect(outboxService.getLength()).toBe(1);
  });
});
