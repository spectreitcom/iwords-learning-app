import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BoxMarkedAsFinishedEventHandler } from './event-handlers/box-marked-as-finished.event-handler';

const EVENT_HANDLERS = [BoxMarkedAsFinishedEventHandler];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [];

@Module({
  imports: [PrismaModule],
  providers: [...EVENT_HANDLERS, ...COMMAND_HANDLERS, ...QUERY_HANDLERS],
  exports: [],
})
export class BoxRepetitionModule {}
