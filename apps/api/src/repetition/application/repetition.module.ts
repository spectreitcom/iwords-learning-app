import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUserRepetitionsQueryHandler } from './query-handlers/get-user-repetitions.query-handler';
import { RepetitionApiService } from './services/repetition-api.service';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [GetUserRepetitionsQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    RepetitionApiService,
  ],
  exports: [RepetitionApiService],
})
export class RepetitionModule {}
