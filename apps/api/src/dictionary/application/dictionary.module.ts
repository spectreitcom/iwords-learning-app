import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ExpressionCreatedEventHandler } from './event-handlers/expression-created.event-handler';
import { ExpressionDeletedEventHandler } from './event-handlers/expression-deleted.event-handler';
import { ExpressionPhraseUpdatedEventHandler } from './event-handlers/expression-phrase-updated.event-handler';
import { CreateExpressionCommandHandler } from './command-handlers/create-expression.command-handler';
import { DeleteExpressionCommandHandler } from './command-handlers/delete-expression.command-handler';
import { UpdateExpressionCommandHandler } from './command-handlers/update-expression.command-handler';
import { ExpressionContextCreatedEventHandler } from './event-handlers/expression-context-created.event-handler';
import { ExpressionContextDeletedEventHandler } from './event-handlers/expression-context-deleted.event-handler';
import { ExpressionContextUpdatedEventHandler } from './event-handlers/expression-context-updated.event-handler';
import { CreateVerbExpressionContextCommandHandler } from './command-handlers/create-verb-expression-context.command-handler';
import { CreateIrregularVerbExpressionContextCommandHandler } from './command-handlers/create-irregular-verb-expression-context.command-handler';
import { CreateNounExpressionContextCommandHandler } from './command-handlers/create-noun-expression-context.command-handler';
import { CreateAdjectiveExpressionContextCommandHandler } from './command-handlers/create-adjective-expression-context.command-handler';
import { CreatePhrasalVerbExpressionContextCommandHandler } from './command-handlers/create-phrasal-verb-expression-context.command-handler';
import { CreateAdverbExpressionContextCommandHandler } from './command-handlers/create-adverb-expression-context.command-handler';
import { DeleteExpressionContextCommandHandler } from './command-handlers/delete-expression-context.command-handler';
import { UpdateVerbExpressionContextCommandHandler } from './command-handlers/update-verb-expression-context.command-handler';
import { UpdateIrregularVerbExpressionContextCommandHandler } from './command-handlers/update-irregular-verb-expression-context.command-handler';
import { UpdateAdjectiveExpressionContextCommandHandler } from './command-handlers/update-adjective-expression-context.command-handler';
import { UpdateAdverbExpressionContextCommandHandler } from './command-handlers/update-adverb-expression-context.command-handler';
import { UpdateNounExpressionContextCommandHandler } from './command-handlers/update-noun-expression-context.command-handler';
import { UpdatePhrasalVerbExpressionContextCommandHandler } from './command-handlers/update-phrasal-verb-expression-context.command-handler';
import { SentenceCreatedEventHandler } from './event-handlers/sentence-created.event-handler';
import { CreateSentenceCommandHandler } from './command-handlers/create-sentence.command-handler';
import { SentenceDeletedEventHandler } from './event-handlers/sentence-deleted.event-handler';
import { DeleteSentenceCommandHandler } from './command-handlers/delete-sentence.command-handler';
import { SentenceUpdatedEventHandler } from './event-handlers/sentence-updated.event-handler';
import { UpdateSentenceCommandHandler } from './command-handlers/update-sentence.command-handler';
import { DictionaryApiService } from './services/dictionary-api.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SearchDictionaryReadModelQueryHandler } from './query-handlers/search-dictionary-read-model.query-handler';
import { GetExpressionByIdQueryHandler } from './query-handlers/get-expression-by-id.query-handler';
import { GetExpressionContextByIdQueryHandler } from './query-handlers/get-expression-context-by-id.query-handler';
import { GetSentenceByIdQueryHandler } from './query-handlers/get-sentence-by-id.query-handler';
import { GetExpressionsListQueryHandler } from './query-handlers/get-expressions-list.query-handler';
import { GetExpressionContextsListQueryHandler } from './query-handlers/get-expression-contexts-list.query-handler';
import { GetDictionaryReadModelsByExpressionContextIdsQueryHandler } from './query-handlers/get-dictionary-read-models-by-expression-context-ids.query-handler';
import { OutboxModule } from '../../common/outbox/outbox.module';
import { GetSentencesByExpressionContextIdsQueryHandler } from './query-handlers/get-sentences-by-expression-context-ids.query-handler';

const EVENT_HANDLERS = [
  ExpressionCreatedEventHandler,
  ExpressionDeletedEventHandler,
  ExpressionPhraseUpdatedEventHandler,
  ExpressionContextCreatedEventHandler,
  ExpressionContextDeletedEventHandler,
  ExpressionContextUpdatedEventHandler,
  SentenceCreatedEventHandler,
  SentenceDeletedEventHandler,
  SentenceUpdatedEventHandler,
];

const COMMAND_HANDLERS = [
  CreateExpressionCommandHandler,
  DeleteExpressionCommandHandler,
  UpdateExpressionCommandHandler,
  CreateVerbExpressionContextCommandHandler,
  CreateNounExpressionContextCommandHandler,
  CreateIrregularVerbExpressionContextCommandHandler,
  CreateAdjectiveExpressionContextCommandHandler,
  CreatePhrasalVerbExpressionContextCommandHandler,
  CreateAdverbExpressionContextCommandHandler,
  DeleteExpressionContextCommandHandler,
  UpdateVerbExpressionContextCommandHandler,
  UpdateIrregularVerbExpressionContextCommandHandler,
  UpdateAdjectiveExpressionContextCommandHandler,
  UpdateAdverbExpressionContextCommandHandler,
  UpdateNounExpressionContextCommandHandler,
  UpdatePhrasalVerbExpressionContextCommandHandler,
  CreateSentenceCommandHandler,
  DeleteSentenceCommandHandler,
  UpdateSentenceCommandHandler,
];

const QUERY_HANDLERS = [
  SearchDictionaryReadModelQueryHandler,
  GetExpressionByIdQueryHandler,
  GetExpressionContextByIdQueryHandler,
  GetSentenceByIdQueryHandler,
  GetExpressionsListQueryHandler,
  GetExpressionContextsListQueryHandler,
  GetDictionaryReadModelsByExpressionContextIdsQueryHandler,
  GetSentencesByExpressionContextIdsQueryHandler,
];

@Module({
  imports: [InfrastructureModule, PrismaModule, OutboxModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    DictionaryApiService,
  ],
  exports: [DictionaryApiService],
})
export class DictionaryModule {}
