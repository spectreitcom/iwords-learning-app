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

@Injectable()
export class DictionaryApiService implements DictionaryApi {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createAdjectiveExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateAdjectiveExpressionContextCommandResponse> {
    const command = new CreateAdjectiveExpressionContextCommand(
      expressionId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  createAdverbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateAdverbExpressionContextCommandResponse> {
    const command = new CreateAdverbExpressionContextCommand(
      expressionId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  createExpression(phrase: string): Promise<CreateExpressionCommandResponse> {
    const command = new CreateExpressionCommand(phrase);
    return this.commandBus.execute(command);
  }

  createIrregularVerbExpressionContext(
    expressionId: string,
    translation: string,
    forms: [string, string, string],
  ): Promise<CreateIrregularVerbExpressionContextCommandResponse> {
    const command = new CreateIrregularVerbExpressionContextCommand(
      expressionId,
      translation,
      forms,
    );
    return this.commandBus.execute(command);
  }

  createNounExpressionContext(
    expressionId: string,
    translation: string,
    isCountable: boolean,
  ): Promise<CreateNounExpressionContextCommandResponse> {
    const command = new CreateNounExpressionContextCommand(
      expressionId,
      translation,
      isCountable,
    );
    return this.commandBus.execute(command);
  }

  createPhrasalVerbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreatePhrasalVerbExpressionContextCommandResponse> {
    const command = new CreatePhrasalVerbExpressionContextCommand(
      expressionId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  createSentence(
    content: string,
    translation: string,
    expressionContextId: string,
  ): Promise<void> {
    const command = new CreateSentenceCommand(
      content,
      translation,
      expressionContextId,
    );
    return this.commandBus.execute(command);
  }

  createVerbExpressionContext(
    expressionId: string,
    translation: string,
  ): Promise<CreateVerbExpressionContextCommandResponse> {
    const command = new CreateVerbExpressionContextCommand(
      expressionId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  deleteExpression(expressionId: string): Promise<void> {
    const command = new DeleteExpressionCommand(expressionId);
    return this.commandBus.execute(command);
  }

  deleteExpressionContext(expressionContextId: string): Promise<void> {
    const command = new DeleteExpressionContextCommand(expressionContextId);
    return this.commandBus.execute(command);
  }

  deleteSentence(sentenceId: string): Promise<void> {
    const command = new DeleteSentenceCommand(sentenceId);
    return this.commandBus.execute(command);
  }

  updateAdjectiveExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateAdjectiveExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  updateAdverbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateAdverbExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  updateExpression(expressionId: string, phrase: string): Promise<void> {
    const command = new UpdateExpressionCommand(expressionId, phrase);
    return this.commandBus.execute(command);
  }

  updateIrregularVerbExpressionContext(
    expressionContextId: string,
    translation: string,
    forms: [string, string, string],
  ): Promise<void> {
    const command = new UpdateIrregularVerbExpressionContextCommand(
      expressionContextId,
      translation,
      forms,
    );
    return this.commandBus.execute(command);
  }

  updateNounExpressionContext(
    expressionContextId: string,
    translation: string,
    isCountable: boolean,
  ): Promise<void> {
    const command = new UpdateNounExpressionContextCommand(
      expressionContextId,
      translation,
      isCountable,
    );
    return this.commandBus.execute(command);
  }

  updatePhrasalVerbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdatePhrasalVerbExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  updateSentence(
    sentenceId: string,
    content: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateSentenceCommand(sentenceId, content, translation);
    return this.commandBus.execute(command);
  }

  updateVerbExpressionContext(
    expressionContextId: string,
    translation: string,
  ): Promise<void> {
    const command = new UpdateVerbExpressionContextCommand(
      expressionContextId,
      translation,
    );
    return this.commandBus.execute(command);
  }

  searchDictionaryReadModel(
    searchText: string,
    take: number,
    page: number,
  ): Promise<SearchDictionaryReadModelQueryResponse> {
    const query = new SearchDictionaryReadModelQuery(searchText, take, page);
    return this.queryBus.execute(query);
  }

  getExpressionById(expressionId: string): Promise<ExpressionView> {
    const query = new GetExpressionByIdQuery(expressionId);
    return this.queryBus.execute(query);
  }
}
