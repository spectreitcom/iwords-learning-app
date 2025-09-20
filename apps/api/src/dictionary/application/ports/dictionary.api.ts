import { CreateVerbExpressionContextCommandResponse } from '../command-handlers/create-verb-expression-context.command-handler';
import { CreateExpressionCommandResponse } from '../command-handlers/create-expression.command-handler';
import { CreateAdjectiveExpressionContextCommandResponse } from '../command-handlers/create-adjective-expression-context.command-handler';
import { CreateAdverbExpressionContextCommandResponse } from '../command-handlers/create-adverb-expression-context.command-handler';
import { CreateNounExpressionContextCommandResponse } from '../command-handlers/create-noun-expression-context.command-handler';
import { CreateIrregularVerbExpressionContextCommandResponse } from '../command-handlers/create-irregular-verb-expression-context.command-handler';
import { CreatePhrasalVerbExpressionContextCommandResponse } from '../command-handlers/create-phrasal-verb-expression-context.command-handler';
import { SearchDictionaryReadModelQueryResponse } from '../query-handlers/search-dictionary-read-model.query-handler';
import { ExpressionView } from '../../views/expression.view';

export abstract class DictionaryApi {
  abstract createExpression(
    phrase: string,
  ): Promise<CreateExpressionCommandResponse>;

  abstract deleteExpression(expressionId: string): Promise<void>;

  abstract updateExpression(
    expressionId: string,
    phrase: string,
  ): Promise<void>;

  abstract deleteExpressionContext(expressionContextId: string): Promise<void>;

  abstract createVerbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateVerbExpressionContextCommandResponse>;

  abstract updateVerbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void>;

  abstract createAdjectiveExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateAdjectiveExpressionContextCommandResponse>;

  abstract updateAdjectiveExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void>;

  abstract createAdverbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateAdverbExpressionContextCommandResponse>;

  abstract updateAdverbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void>;

  abstract createNounExpressionContext(
    expressionId: string,
    translation: string,
    isCountable: boolean,
  ): Promise<CreateNounExpressionContextCommandResponse>;

  abstract updateNounExpressionContext(
    expressionContextId: string,
    translation: string,
    isCountable: boolean,
  ): Promise<void>;

  abstract createIrregularVerbExpressionContext(
    expressionId: string,
    translation: string,
    forms: [string, string, string],
  ): Promise<CreateIrregularVerbExpressionContextCommandResponse>;

  abstract updateIrregularVerbExpressionContext(
    expressionContextId: string,
    translation: string,
    forms: [string, string, string],
  ): Promise<void>;

  abstract createPhrasalVerbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreatePhrasalVerbExpressionContextCommandResponse>;

  abstract updatePhrasalVerbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void>;

  abstract createSentence(
    content: string,
    translation: string,
    expressionContextId: string,
  ): Promise<void>;

  abstract updateSentence(
    sentenceId: string,
    content: string,
    translation: string,
  ): Promise<void>;

  abstract deleteSentence(sentenceId: string): Promise<void>;

  abstract searchDictionaryReadModel(
    searchText: string,
    take: number,
    page: number,
  ): Promise<SearchDictionaryReadModelQueryResponse>;

  abstract getExpressionById(expressionId: string): Promise<ExpressionView>;

  abstract getExpressionContextById(
    expressionContextId: string,
  ): Promise<ExpressionView>;

  abstract getSentenceById(sentenceId: string): Promise<ExpressionView>;
}
