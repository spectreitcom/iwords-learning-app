import { randomUUID } from 'node:crypto';
import { FakeRepetitionRepository } from '../../../../../__tests/fakes/fake-repetition-repository';
import { DeleteOneUserRepetitionCommandHandler } from '../delete-one-user-repetition.command-handler';

describe('DeleteOneUserRepetitionCommandHandler', () => {
  it("it should delete the user's repetition from the list", async () => {
    const USER_ID = randomUUID();
    const REPETITION_ID = randomUUID();

    const repetitionRepository = new FakeRepetitionRepository([
      {
        id: REPETITION_ID,
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
    ]);

    const handler = new DeleteOneUserRepetitionCommandHandler(
      repetitionRepository,
    );

    await handler.execute({
      userId: USER_ID,
      repetitionId: REPETITION_ID,
    });

    expect(repetitionRepository.getLength()).toEqual(2);
  });
});
