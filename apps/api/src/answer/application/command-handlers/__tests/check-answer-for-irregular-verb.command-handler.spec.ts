import { FakeOutboxService } from '../../../../../__tests/fakes/fake-outbox.service';
import { FakeTransactionRunner } from '../../../../../__tests/fakes/fake-transaction-runner';
import { FakeAnswerExpressionContextReadRepository } from './fakes/fake-answer-expression-context-read.repository';
import { CheckAnswerForIrregularVerbCommandHandler } from '../check-answer-for-irregular-verb.command-handler';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../../common/errors';

describe('CheckAnswerForIrregularVerbCommandHandler', () => {
  it('should return response when all forms are correct', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();
    const FORMS: [string, string, string] = ['go', 'went', 'gone'];

    const answerExpressionContextReadRepository =
      new FakeAnswerExpressionContextReadRepository([
        {
          id: randomUUID(),
          phrase: 'go',
          expressionId: randomUUID(),
          expressionContextId: EXPRESSION_CONTEXT_ID,
          type: 'some type',
          translation: 'iść',
          forms: FORMS,
          isIrregular: true,
          isCountable: false,
          sentenceIds: [],
        },
      ]);

    const handler = new CheckAnswerForIrregularVerbCommandHandler(
      outboxService,
      transactionRunner,
      answerExpressionContextReadRepository,
    );

    const result = await handler.execute({
      userId: USER_ID,
      expressionContextId: EXPRESSION_CONTEXT_ID,
      answer: FORMS,
    });

    expect(result).toEqual({
      form1: {
        correct: true,
        userAnswer: FORMS[0],
        correctAnswer: FORMS[0],
      },
      form2: {
        correct: true,
        userAnswer: FORMS[1],
        correctAnswer: FORMS[1],
      },
      form3: {
        correct: true,
        userAnswer: FORMS[2],
        correctAnswer: FORMS[2],
      },
      allCorrect: true,
    });

    expect(outboxService.getLength()).toEqual(1);
  });

  it('should return response when some forms are incorrect', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();
    const FORMS: [string, string, string] = ['go', 'went', 'gone'];
    const USER_ANSWER: [string, string, string] = ['go', 'went', 'go'];

    const answerExpressionContextReadRepository =
      new FakeAnswerExpressionContextReadRepository([
        {
          id: randomUUID(),
          phrase: 'go',
          expressionId: randomUUID(),
          expressionContextId: EXPRESSION_CONTEXT_ID,
          type: 'some type',
          translation: 'iść',
          forms: FORMS,
          isIrregular: true,
          isCountable: false,
          sentenceIds: [],
        },
      ]);

    const handler = new CheckAnswerForIrregularVerbCommandHandler(
      outboxService,
      transactionRunner,
      answerExpressionContextReadRepository,
    );

    const result = await handler.execute({
      userId: USER_ID,
      expressionContextId: EXPRESSION_CONTEXT_ID,
      answer: USER_ANSWER,
    });

    expect(result).toEqual({
      form1: {
        correct: true,
        userAnswer: USER_ANSWER[0],
        correctAnswer: FORMS[0],
      },
      form2: {
        correct: true,
        userAnswer: USER_ANSWER[1],
        correctAnswer: FORMS[1],
      },
      form3: {
        correct: false,
        userAnswer: USER_ANSWER[2],
        correctAnswer: FORMS[2],
      },
      allCorrect: false,
    });

    expect(outboxService.getLength()).toEqual(1);
  });

  it('should throw an error when expression context is not found', async () => {
    const outboxService = new FakeOutboxService();
    const transactionRunner = new FakeTransactionRunner();

    const USER_ID = randomUUID();
    const EXPRESSION_CONTEXT_ID = randomUUID();

    const answerExpressionContextReadRepository =
      new FakeAnswerExpressionContextReadRepository([]);

    const handler = new CheckAnswerForIrregularVerbCommandHandler(
      outboxService,
      transactionRunner,
      answerExpressionContextReadRepository,
    );

    await expect(
      handler.execute({
        userId: USER_ID,
        expressionContextId: EXPRESSION_CONTEXT_ID,
        answer: ['go', 'went', 'gone'],
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
