import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ExpressionCreatedEventHandler } from './event-handlers/expression-created.event-handler';
import { ExpressionDeletedEventHandler } from './event-handlers/expression-deleted.event-handler';
import { ExpressionPhraseUpdatedEventHandler } from './event-handlers/expression-phrase-updated.event-handler';
import { CreateExpressionCommandHandler } from './command-handlers/create-expression.command-handler';
import { DeleteExpressionCommandHandler } from './command-handlers/delete-expression.command-handler';
import { UpdateExpressionCommandHandler } from './command-handlers/update-expression.command-handler';

const EVENT_HANDLERS = [
  ExpressionCreatedEventHandler,
  ExpressionDeletedEventHandler,
  ExpressionPhraseUpdatedEventHandler,
];

const COMMAND_HANDLERS = [
  CreateExpressionCommandHandler,
  DeleteExpressionCommandHandler,
  UpdateExpressionCommandHandler,
];

const QUERY_HANDLERS = [];

@Module({
  imports: [InfrastructureModule],
  providers: [...EVENT_HANDLERS, ...COMMAND_HANDLERS, ...QUERY_HANDLERS],
  exports: [],
})
export class DictionaryModule {}
