import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BoxCreatedEventHandler } from './event-handlers/box-created.event-handler';
import { BoxUpdatedEventHandler } from './event-handlers/box-updated.event-handler';
import { ExpressionContextIdAddedEventHandler } from './event-handlers/expression-context-id-added.event-handler';
import { ExpressionContextIdRemovedEventHandler } from './event-handlers/expression-context-id-removed.event-handler';
import { CreateBoxCommandHandler } from './command-handlers/create-box.command-handler';
import { BoxApiService } from './services/box-api.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetBoxByIdQueryHandler } from './query-handlers/get-box-by-id.query-handler';
import { DeleteBoxCommandHandler } from './command-handlers/delete-box.command-handler';
import { BoxDeletedEventHandler } from './event-handlers/box-deleted.event-handler';
import { UpdateBoxCommandHandler } from './command-handlers/update-box.command-handler';
import { GetBoxesListQueryHandler } from './query-handlers/get-boxes-list.query-handler';
import { AddExpressionContextIdCommandHandler } from './command-handlers/add-expression-context-id.command-handler';
import { RemoveExpressionContextIdCommandHandler } from './command-handlers/remove-expression-context-id.command-handler';
import { BeginBoxCommandHandler } from './command-handlers/begin-box.command-handler';
import { IsBoxStartedQueryHandler } from './query-handlers/is-box-started.query-handler';
import { GetBoxesNumberQueryHandler } from './query-handlers/get-boxes-number.query-handler';
import { MarkBoxAsFinishedCommandHandler } from './command-handlers/mark-box-as-finished.command-handler';
import { GetInformationIfBoxIsFinishedByBoxIdsQueryHandler } from './query-handlers/get-information-if-box-is-finished-by-box-ids.query-handler';
import { OutboxModule } from '../../common/outbox/outbox.module';
import { GetBoxesByIdsQueryHandler } from './query-handlers/get-boxes-by-ids.query-handler';

const EVENT_HANDLERS = [
  BoxCreatedEventHandler,
  BoxUpdatedEventHandler,
  ExpressionContextIdAddedEventHandler,
  ExpressionContextIdRemovedEventHandler,
  BoxDeletedEventHandler,
];

const COMMAND_HANDLERS = [
  CreateBoxCommandHandler,
  DeleteBoxCommandHandler,
  UpdateBoxCommandHandler,
  AddExpressionContextIdCommandHandler,
  RemoveExpressionContextIdCommandHandler,
  BeginBoxCommandHandler,
  MarkBoxAsFinishedCommandHandler,
];

const QUERY_HANDLERS = [
  GetBoxByIdQueryHandler,
  GetBoxesListQueryHandler,
  IsBoxStartedQueryHandler,
  GetBoxesNumberQueryHandler,
  GetInformationIfBoxIsFinishedByBoxIdsQueryHandler,
  GetBoxesByIdsQueryHandler,
];

@Module({
  imports: [InfrastructureModule, PrismaModule, OutboxModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    BoxApiService,
  ],
  exports: [BoxApiService],
})
export class BoxModule {}
