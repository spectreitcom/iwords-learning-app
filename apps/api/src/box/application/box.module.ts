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

const EVENT_HANDLERS = [
  BoxCreatedEventHandler,
  BoxUpdatedEventHandler,
  ExpressionContextIdAddedEventHandler,
  ExpressionContextIdRemovedEventHandler,
];

const COMMAND_HANDLERS = [CreateBoxCommandHandler];

const QUERY_HANDLERS = [GetBoxByIdQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    BoxApiService,
  ],
  exports: [BoxApiService],
})
export class BoxModule {}
