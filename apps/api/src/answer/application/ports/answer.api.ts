import { CheckAnswerForSimpleTranslationCommandResponse } from '../command-handlers/check-answer-for-simple-translation.command-handler';
import { CheckAnswerForIrregularVerbCommandResponse } from '../command-handlers/check-answer-for-irregular-verb.command-handler';
import { CheckAnswerForSentenceCommandResponse } from '../command-handlers/check-answer-for-sentence.command-handler';
import { ValidateSentenceUsingAiCommandResponse } from '../command-handlers/validate-sentence-using-ai.command-handler';

export abstract class AnswerApi {
  abstract checkAnswerForSimpleTranslation(
    answer: string,
    expressionContextId: string,
    userId: string,
  ): Promise<CheckAnswerForSimpleTranslationCommandResponse>;

  abstract checkAnswerForIrregularVerb(
    answer: [string, string, string],
    expressionContextId: string,
    userId: string,
  ): Promise<CheckAnswerForIrregularVerbCommandResponse>;

  abstract checkAnswerForSentence(
    answer: string,
    sentenceId: string,
    userId: string,
  ): Promise<CheckAnswerForSentenceCommandResponse>;

  abstract validateSentenceUsingAi(
    expressionContextId: string,
    userId: string,
    userSentence: string,
  ): Promise<ValidateSentenceUsingAiCommandResponse>;
}
