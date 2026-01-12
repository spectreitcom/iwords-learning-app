import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { FakeAnswerSentenceReadRepository } from './fakes/fake-answer-sentence-read.repository';
import { CheckAnswerForSentenceCommandHandler } from '../check-answer-for-sentence.command-handler';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('CheckAnswerForSentenceCommandHandler', () => {
  it('should check answer and return result when answer is correct', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const SENTENCE_ID = randomUUID();
    const ANSWER = 'correct answer';

    const answerSentenceReadRepository = new FakeAnswerSentenceReadRepository([
      {
        id: randomUUID(),
        sentenceId: SENTENCE_ID,
        translation: 'some translation',
        content: ANSWER,
        expressionContextId: randomUUID(),
        expressionId: randomUUID(),
      },
    ]);

    const handler = new CheckAnswerForSentenceCommandHandler(
      outboxService,
      transactionRunner,
      answerSentenceReadRepository,
    );

    const result = await handler.execute({
      userId: USER_ID,
      sentenceId: SENTENCE_ID,
      answer: ANSWER,
    });

    expect(result).toEqual({
      correct: true,
      userAnswer: ANSWER,
      correctAnswer: ANSWER,
    });

    expect(outboxService.getLength()).toEqual(1);
  });

  it('should check answer and return result when answer is incorrect', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const SENTENCE_ID = randomUUID();
    const ANSWER = 'correct answer';
    const USER_ANSWER = 'incorrect answer';

    const answerSentenceReadRepository = new FakeAnswerSentenceReadRepository([
      {
        id: randomUUID(),
        sentenceId: SENTENCE_ID,
        translation: 'some translation',
        content: ANSWER,
        expressionContextId: randomUUID(),
        expressionId: randomUUID(),
      },
    ]);

    const handler = new CheckAnswerForSentenceCommandHandler(
      outboxService,
      transactionRunner,
      answerSentenceReadRepository,
    );

    const result = await handler.execute({
      userId: USER_ID,
      sentenceId: SENTENCE_ID,
      answer: USER_ANSWER,
    });

    expect(result).toEqual({
      correct: false,
      userAnswer: USER_ANSWER,
      correctAnswer: ANSWER,
    });

    expect(outboxService.getLength()).toEqual(1);
  });

  it('should throw an error when sentence is not found', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const SENTENCE_ID = randomUUID();
    const ANSWER = 'correct answer';

    const answerSentenceReadRepository = new FakeAnswerSentenceReadRepository([
      {
        id: randomUUID(),
        sentenceId: randomUUID(),
        translation: 'some translation',
        content: ANSWER,
        expressionContextId: randomUUID(),
        expressionId: randomUUID(),
      },
    ]);

    const handler = new CheckAnswerForSentenceCommandHandler(
      outboxService,
      transactionRunner,
      answerSentenceReadRepository,
    );

    await expect(
      handler.execute({
        userId: USER_ID,
        sentenceId: SENTENCE_ID,
        answer: ANSWER,
      }),
    ).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        `Answer sentence with id ${SENTENCE_ID} not found`,
      ),
    );

    expect(outboxService.getLength()).toEqual(0);
  });
});
