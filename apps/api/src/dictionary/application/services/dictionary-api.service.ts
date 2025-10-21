import { Injectable } from '@nestjs/common';
import { DictionaryApi } from '../ports/dictionary.api';
import { CreateAdjectiveExpressionContextCommandResponse } from '../command-handlers/create-adjective-expression-context.command-handler';
import { CreateAdverbExpressionContextCommandResponse } from '../command-handlers/create-adverb-expression-context.command-handler';
import { CreateExpressionCommandResponse } from '../command-handlers/create-expression.command-handler';
import { CreateIrregularVerbExpressionContextCommandResponse } from '../command-handlers/create-irregular-verb-expression-context.command-handler';
import { CreateNounExpressionContextCommandResponse } from '../command-handlers/create-noun-expression-context.command-handler';
import { CreatePhrasalVerbExpressionContextCommandResponse } from '../command-handlers/create-phrasal-verb-expression-context.command-handler';
import { CreateVerbExpressionContextCommandResponse } from '../command-handlers/create-verb-expression-context.command-handler';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateExpressionCommand } from '../commands/create-expression.command';
import { DeleteExpressionCommand } from '../commands/delete-expression.command';
import { UpdateExpressionCommand } from '../commands/update-expression.command';
import { CreateVerbExpressionContextCommand } from '../commands/create-verb-expression-context.command';
import { UpdateVerbExpressionContextCommand } from '../commands/update-verb-expression-context.command';
import { CreateAdjectiveExpressionContextCommand } from '../commands/create-adjective-expression-context.command';
import { UpdateAdjectiveExpressionContextCommand } from '../commands/update-adjective-expression-context.command';
import { CreateAdverbExpressionContextCommand } from '../commands/create-adverb-expression-context.command';
import { UpdateAdverbExpressionContextCommand } from '../commands/update-adverb-expression-context.command';
import { CreateNounExpressionContextCommand } from '../commands/create-noun-expression-context.command';
import { UpdateNounExpressionContextCommand } from '../commands/update-noun-expression-context.command';
import { CreateIrregularVerbExpressionContextCommand } from '../commands/create-irregular-verb-expression-context.command';
import { UpdateIrregularVerbExpressionContextCommand } from '../commands/update-irregular-verb-expression-context.command';
import { CreatePhrasalVerbExpressionContextCommand } from '../commands/create-phrasal-verb-expression-context.command';
import { UpdatePhrasalVerbExpressionContextCommand } from '../commands/update-phrasal-verb-expression-context.command';
import { DeleteExpressionContextCommand } from '../commands/delete-expression-context.command';
import { CreateSentenceCommand } from '../commands/create-sentence.command';
import { UpdateSentenceCommand } from '../commands/update-sentence.command';
import { DeleteSentenceCommand } from '../commands/delete-sentence.command';
import { SearchDictionaryReadModelQueryResponse } from '../query-handlers/search-dictionary-read-model.query-handler';
import { SearchDictionaryReadModelQuery } from '../queries/search-dictionary-read-model.query';
import { ExpressionView } from '../../views/expression.view';
import { GetExpressionByIdQuery } from '../queries/get-expression-by-id.query';
import { GetExpressionContextByIdQuery } from '../queries/get-expression-context-by-id.query';
import { GetSentenceByIdQuery } from '../queries/get-sentence-by-id.query';
import { GetExpressionListQueryResponse } from '../query-handlers/get-expressions-list.query-handler';
import { GetExpressionsListQuery } from '../queries/get-expressions-list.query';
import { GetExpressionContextsListQueryResponse } from '../query-handlers/get-expression-contexts-list.query-handler';
import { GetExpressionContextsListQuery } from '../queries/get-expression-contexts-list.query';
import { DictionaryReadModel } from '../../read-models/dictionary-read-model';
import { GetDictionaryReadModelsByExpressionContextIdsQuery } from '../queries/get-dictionary-read-models-by-expression-context-ids.query';
import { SentenceView } from '../../views/sentence.view';
import { GetSentencesByExpressionContextIdsQuery } from '../queries/get-sentences-by-expression-context-ids.query';

@Injectable()
export class DictionaryApiService implements DictionaryApi {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createAdjectiveExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateAdjectiveExpressionContextCommandResponse> {
    const command = new CreateAdjectiveExpressionContextCommand(
      expressionId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async createAdverbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateAdverbExpressionContextCommandResponse> {
    const command = new CreateAdverbExpressionContextCommand(
      expressionId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async createExpression(
    phrase: string,
  ): Promise<CreateExpressionCommandResponse> {
    const command = new CreateExpressionCommand(phrase);
    return await this.commandBus.execute(command);
  }

  async createIrregularVerbExpressionContext(
    expressionId: string,
    translation: string,
    forms: [string, string, string],
  ): Promise<CreateIrregularVerbExpressionContextCommandResponse> {
    const command = new CreateIrregularVerbExpressionContextCommand(
      expressionId,
      translation,
      forms,
    );
    return await this.commandBus.execute(command);
  }

  async createNounExpressionContext(
    expressionId: string,
    translation: string,
    isCountable: boolean,
  ): Promise<CreateNounExpressionContextCommandResponse> {
    const command = new CreateNounExpressionContextCommand(
      expressionId,
      translation,
      isCountable,
    );
    return await this.commandBus.execute(command);
  }

  async createPhrasalVerbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreatePhrasalVerbExpressionContextCommandResponse> {
    const command = new CreatePhrasalVerbExpressionContextCommand(
      expressionId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async createSentence(
    content: string,
    translation: string,
    expressionContextId: string,
  ): Promise<void> {
    const command = new CreateSentenceCommand(
      content,
      translation,
      expressionContextId,
    );
    return await this.commandBus.execute(command);
  }

  async createVerbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateVerbExpressionContextCommandResponse> {
    const command = new CreateVerbExpressionContextCommand(
      expressionId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async deleteExpression(expressionId: string): Promise<void> {
    const command = new DeleteExpressionCommand(expressionId);
    return await this.commandBus.execute(command);
  }

  async deleteExpressionContext(expressionContextId: string): Promise<void> {
    const command = new DeleteExpressionContextCommand(expressionContextId);
    return await this.commandBus.execute(command);
  }

  async deleteSentence(sentenceId: string): Promise<void> {
    const command = new DeleteSentenceCommand(sentenceId);
    return await this.commandBus.execute(command);
  }

  async updateAdjectiveExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateAdjectiveExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async updateAdverbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateAdverbExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async updateExpression(expressionId: string, phrase: string): Promise<void> {
    const command = new UpdateExpressionCommand(expressionId, phrase);
    return await this.commandBus.execute(command);
  }

  async updateIrregularVerbExpressionContext(
    expressionContextId: string,
    translation: string,
    forms: [string, string, string],
  ): Promise<void> {
    const command = new UpdateIrregularVerbExpressionContextCommand(
      expressionContextId,
      translation,
      forms,
    );
    return await this.commandBus.execute(command);
  }

  async updateNounExpressionContext(
    expressionContextId: string,
    translation: string,
    isCountable: boolean,
  ): Promise<void> {
    const command = new UpdateNounExpressionContextCommand(
      expressionContextId,
      translation,
      isCountable,
    );
    return await this.commandBus.execute(command);
  }

  async updatePhrasalVerbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdatePhrasalVerbExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async updateSentence(
    sentenceId: string,
    content: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateSentenceCommand(sentenceId, content, translation);
    return await this.commandBus.execute(command);
  }

  async updateVerbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateVerbExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return await this.commandBus.execute(command);
  }

  async searchDictionaryReadModel(
    searchText: string | undefined,
    take: number,
    page: number,
  ): Promise<SearchDictionaryReadModelQueryResponse> {
    const query = new SearchDictionaryReadModelQuery(searchText, take, page);
    return await this.queryBus.execute(query);
  }

  async getExpressionById(expressionId: string): Promise<ExpressionView> {
    const query = new GetExpressionByIdQuery(expressionId);
    return await this.queryBus.execute(query);
  }

  async getExpressionContextById(
    expressionContextId: string,
  ): Promise<ExpressionView> {
    const query = new GetExpressionContextByIdQuery(expressionContextId);
    return await this.queryBus.execute(query);
  }

  async getSentenceById(sentenceId: string): Promise<SentenceView> {
    const query = new GetSentenceByIdQuery(sentenceId);
    return await this.queryBus.execute(query);
  }

  async getExpressionsList(
    searchText: string | undefined,
    take: number,
    page: number,
  ): Promise<GetExpressionListQueryResponse> {
    const query = new GetExpressionsListQuery(take, page, searchText);
    return await this.queryBus.execute(query);
  }

  async getExpressionContextList(
    expressionId: string,
    take: number,
    page: number,
  ): Promise<GetExpressionContextsListQueryResponse> {
    const query = new GetExpressionContextsListQuery(expressionId, take, page);
    return await this.queryBus.execute(query);
  }

  async getDictionaryReadModelsByExpressionContextIds(
    expressionContextIds: string[],
  ): Promise<DictionaryReadModel[]> {
    const query = new GetDictionaryReadModelsByExpressionContextIdsQuery(
      expressionContextIds,
    );
    return await this.queryBus.execute(query);
  }

  async getSentencesByExpressionContextIds(
    expressionContextIds: string[],
  ): Promise<SentenceView[]> {
    const query = new GetSentencesByExpressionContextIdsQuery(
      expressionContextIds,
    );
    return await this.queryBus.execute(query);
  }
}
