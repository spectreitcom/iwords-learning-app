import { randomUUID } from 'node:crypto';
import { FakeRepetitionRepository } from '../../../../answer/application/command-handlers/__tests/fakes/fake-repetition-repository';
import { FakeClock } from './fakes/fake-clock';
import { AddExpressionContextToRepetitionCommandHandler } from '../add-expression-context-to-repetition.command-handler';
import { AddExpressionContextToRepetitionCommand } from '../../commands/add-expression-context-to-repetition.command';

describe('AddExpressionContextToRepetitionCommandHandler', () => {
  it('it should create a new repetition and save it', async () => {
    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();
    const NOW = new Date('2030-01-01T12:00:00.000Z');

    const repetitionRepository = new FakeRepetitionRepository();
    const clock = new FakeClock(NOW);
    const handler = new AddExpressionContextToRepetitionCommandHandler(
      repetitionRepository,
      clock,
    );

    await handler.execute(
      new AddExpressionContextToRepetitionCommand(
        EXPRESSION_CONTEXT_ID,
        USER_ID,
      ),
    );

    expect(repetitionRepository.getLength()).toEqual(1);
    const userRepetitions = await repetitionRepository.findByUser(USER_ID);
    expect(userRepetitions).toHaveLength(1);
    expect(userRepetitions[0].getUserId().value).toEqual(USER_ID);
    expect(userRepetitions[0].getExpressionContextId().value).toEqual(
      EXPRESSION_CONTEXT_ID,
    );

    const expectedNextRepetitionDate = new Date(NOW);
    expectedNextRepetitionDate.setDate(
      expectedNextRepetitionDate.getDate() + 1,
    );
    expect(userRepetitions[0].getNextRepetition().value).toEqual(
      expectedNextRepetitionDate,
    );
  });
});
