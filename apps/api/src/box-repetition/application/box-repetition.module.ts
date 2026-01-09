import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BoxMarkedAsFinishedEventHandler } from './event-handlers/box-marked-as-finished.event-handler';
import { GetBoxIdsForCurrentRepetitionQueryHandler } from './query-handlers/get-box-ids-for-current-repetition.query-handler';
import { BoxRepetitionApiService } from './services/box-repetition-api.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

const EVENT_HANDLERS = [BoxMarkedAsFinishedEventHandler];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [GetBoxIdsForCurrentRepetitionQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    BoxRepetitionApiService,
  ],
  exports: [BoxRepetitionApiService],
})
export class BoxRepetitionModule {}
