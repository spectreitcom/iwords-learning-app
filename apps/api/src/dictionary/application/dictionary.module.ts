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

const EVENT_HANDLERS = [
  ExpressionCreatedEventHandler,
  ExpressionDeletedEventHandler,
  ExpressionPhraseUpdatedEventHandler,
  ExpressionContextCreatedEventHandler,
  ExpressionContextDeletedEventHandler,
  ExpressionContextUpdatedEventHandler,
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
];

const QUERY_HANDLERS = [];

@Module({
  imports: [InfrastructureModule],
  providers: [...EVENT_HANDLERS, ...COMMAND_HANDLERS, ...QUERY_HANDLERS],
  exports: [],
})
export class DictionaryModule {}
