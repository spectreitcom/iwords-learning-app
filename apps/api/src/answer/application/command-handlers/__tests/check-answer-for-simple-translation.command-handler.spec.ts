import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { FakeAnswerExpressionContextReadRepository } from './fakes/fake-answer-expression-context-read.repository';
import { FakeAnswerSentenceReadRepository } from './fakes/fake-answer-sentence-read.repository';
import { CheckAnswerForSimpleTranslationCommandHandler } from '../check-answer-for-simple-translation.command-handler';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('CheckAnswerForSimpleTranslationCommandHandler', () => {
  it('should return response when answer is correct', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();
    const PHRASE = 'correct answer';

    const answerExpressionContextReadRepository =
      new FakeAnswerExpressionContextReadRepository([
        {
          id: randomUUID(),
          phrase: PHRASE,
          expressionId: randomUUID(),
          expressionContextId: EXPRESSION_CONTEXT_ID,
          type: 'some type',
          translation: 'some translation',
          forms: [],
          isIrregular: false,
          isCountable: false,
          sentenceIds: [],
        },
      ]);

    const answerSentenceReadRepository = new FakeAnswerSentenceReadRepository();

    const handler = new CheckAnswerForSimpleTranslationCommandHandler(
      outboxService,
      transactionRunner,
      answerExpressionContextReadRepository,
      answerSentenceReadRepository,
    );

    const result = await handler.execute({
      userId: USER_ID,
      expressionContextId: EXPRESSION_CONTEXT_ID,
      answer: PHRASE,
    });

    expect(result).toEqual({
      correct: true,
      userAnswer: PHRASE,
      correctAnswer: PHRASE,
      sentences: [],
    });

    expect(outboxService.getLength()).toEqual(1);
  });

  it('should return response when answer is incorrect', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();
    const PHRASE = 'correct answer';
    const USER_ANSWER = 'incorrect answer';

    const answerExpressionContextReadRepository =
      new FakeAnswerExpressionContextReadRepository([
        {
          id: randomUUID(),
          phrase: PHRASE,
          expressionId: randomUUID(),
          expressionContextId: EXPRESSION_CONTEXT_ID,
          type: 'some type',
          translation: 'some translation',
          forms: [],
          isIrregular: false,
          isCountable: false,
          sentenceIds: [],
        },
      ]);

    const answerSentenceReadRepository = new FakeAnswerSentenceReadRepository();

    const handler = new CheckAnswerForSimpleTranslationCommandHandler(
      outboxService,
      transactionRunner,
      answerExpressionContextReadRepository,
      answerSentenceReadRepository,
    );

    const result = await handler.execute({
      userId: USER_ID,
      expressionContextId: EXPRESSION_CONTEXT_ID,
      answer: USER_ANSWER,
    });

    expect(result).toEqual({
      correct: false,
      userAnswer: USER_ANSWER,
      correctAnswer: PHRASE,
      sentences: [],
    });

    expect(outboxService.getLength()).toEqual(1);
  });

  it('should throw an error when sentence is not found', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();
    const PHRASE = 'correct answer';

    const answerExpressionContextReadRepository =
      new FakeAnswerExpressionContextReadRepository([]);

    const answerSentenceReadRepository = new FakeAnswerSentenceReadRepository();

    const handler = new CheckAnswerForSimpleTranslationCommandHandler(
      outboxService,
      transactionRunner,
      answerExpressionContextReadRepository,
      answerSentenceReadRepository,
    );

    await expect(
      handler.execute({
        userId: USER_ID,
        expressionContextId: EXPRESSION_CONTEXT_ID,
        answer: PHRASE,
      }),
    ).rejects.toThrow(
      new AppError(
        'ENTITY_NOT_FOUND',
        `Answer expression context with id ${EXPRESSION_CONTEXT_ID} not found`,
      ),
    );

    expect(outboxService.getLength()).toEqual(0);
  });
});
