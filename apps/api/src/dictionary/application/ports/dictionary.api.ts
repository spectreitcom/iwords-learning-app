import { CreateVerbExpressionContextCommandResponse } from '../command-handlers/create-verb-expression-context.command-handler';
import { CreateExpressionCommandResponse } from '../command-handlers/create-expression.command-handler';
import { CreateAdjectiveExpressionContextCommandResponse } from '../command-handlers/create-adjective-expression-context.command-handler';
import { CreateAdverbExpressionContextCommandResponse } from '../command-handlers/create-adverb-expression-context.command-handler';
import { CreateNounExpressionContextCommandResponse } from '../command-handlers/create-noun-expression-context.command-handler';
import { CreateSimpleExpressionContextCommandResponse } from '../command-handlers/create-simple-expression-context.command-handler';
import { CreateIrregularVerbExpressionContextCommandResponse } from '../command-handlers/create-irregular-verb-expression-context.command-handler';
import { CreatePhrasalVerbExpressionContextCommandResponse } from '../command-handlers/create-phrasal-verb-expression-context.command-handler';
import { SearchDictionaryReadModelQueryResponse } from '../query-handlers/search-dictionary-read-model.query-handler';
import { ExpressionView } from '../../views/expression.view';
import { GetExpressionListQueryResponse } from '../query-handlers/get-expressions-list.query-handler';
import { GetExpressionContextsListQueryResponse } from '../query-handlers/get-expression-contexts-list.query-handler';
import { DictionaryReadModel } from '../../read-models/dictionary-read-model';
import { SentenceView } from '../../views/sentence.view';
import { ExpressionContextView } from '../../views/expression-context.view';

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

  abstract createSimpleExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateSimpleExpressionContextCommandResponse>;

  abstract updateAdverbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void>;

  abstract updateSimpleExpressionContext(
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
    searchText: string | undefined,
    take: number,
    page: number,
  ): Promise<SearchDictionaryReadModelQueryResponse>;

  abstract getExpressionById(expressionId: string): Promise<ExpressionView>;

  abstract getExpressionContextById(
    expressionContextId: string,
  ): Promise<ExpressionContextView>;

  abstract getSentenceById(sentenceId: string): Promise<SentenceView>;

  abstract getExpressionsList(
    searchText: string | undefined,
    take: number,
    page: number,
  ): Promise<GetExpressionListQueryResponse>;

  abstract getExpressionContextList(
    expressionId: string,
    take: number,
    page: number,
  ): Promise<GetExpressionContextsListQueryResponse>;

  abstract getDictionaryReadModelsByExpressionContextIds(
    expressionContextIds: string[],
  ): Promise<DictionaryReadModel[]>;

  abstract getSentencesByExpressionContextIds(
    expressionContextIds: string[],
  ): Promise<SentenceView[]>;

  abstract getExpressionsNumber(): Promise<number>;
}
