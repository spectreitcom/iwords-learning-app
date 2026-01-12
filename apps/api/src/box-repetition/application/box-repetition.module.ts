import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BoxMarkedAsFinishedEventHandler } from './event-handlers/box-marked-as-finished.event-handler';
import { GetBoxIdsForCurrentRepetitionQueryHandler } from './query-handlers/get-box-ids-for-current-repetition.query-handler';
import BoxRepetitionApiService from './services/box-repetition-api.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GetBoxesRepetitionDataQueryHandler } from './query-handlers/get-boxes-repetition-data.query-handler';
import { ClockModule } from '../../common/clock/clock.module';

const EVENT_HANDLERS = [BoxMarkedAsFinishedEventHandler];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [
  GetBoxIdsForCurrentRepetitionQueryHandler,
  GetBoxesRepetitionDataQueryHandler,
];

@Module({
  imports: [InfrastructureModule, PrismaModule, ClockModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    BoxRepetitionApiService,
  ],
  exports: [BoxRepetitionApiService],
})
export class BoxRepetitionModule {}
