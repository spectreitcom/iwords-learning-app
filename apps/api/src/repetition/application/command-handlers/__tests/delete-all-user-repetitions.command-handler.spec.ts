import {
  FakeRepetitionRepository,
  RepetitionModel,
} from '../../../../answer/application/command-handlers/__tests/fakes/fake-repetition-repository';
import { randomUUID } from 'node:crypto';
import { DeleteAllUserRepetitionsCommandHandler } from '../delete-all-user-repetitions.command-handler';

describe('DeleteAllUserRepetitionsCommandHandler', () => {
  it("deletes the all user's repetition from the list", async () => {
    const USER_ID = randomUUID();

    const records: RepetitionModel[] = [
      {
        id: randomUUID(),
        userId: USER_ID,
        nextRepetition: new Date(),
        expressionContextId: randomUUID(),
      },
      {
        id: randomUUID(),
        userId: USER_ID,
        nextRepetition: new Date(),
        expressionContextId: randomUUID(),
      },
      {
        id: randomUUID(),
        userId: randomUUID(),
        nextRepetition: new Date(),
        expressionContextId: randomUUID(),
      },
    ];

    const repetitionRepository = new FakeRepetitionRepository(records);

    const handler = new DeleteAllUserRepetitionsCommandHandler(
      repetitionRepository,
    );

    await handler.execute({ userId: USER_ID });

    expect(repetitionRepository.getLength()).toEqual(1);
  });
});
