import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GetUserRepetitionsQueryHandler } from './query-handlers/get-user-repetitions.query-handler';
import { RepetitionApiService } from './services/repetition-api.service';
import { DeleteAllUserRepetitionsCommandHandler } from './command-handlers/delete-all-user-repetitions.command-handler';
import { DeleteOneUserRepetitionCommandHandler } from './command-handlers/delete-one-user-repetition.command-handler';
import { AnswerCheckedEventHandler } from './event-handlers/answer-checked.event-handler';
import { ClockModule } from '../../common/clock/clock.module';
import { AddExpressionContextToRepetitionCommandHandler } from './command-handlers/add-expression-context-to-repetition.command-handler';

const EVENT_HANDLERS = [AnswerCheckedEventHandler];

const COMMAND_HANDLERS = [
  DeleteAllUserRepetitionsCommandHandler,
  DeleteOneUserRepetitionCommandHandler,
  AddExpressionContextToRepetitionCommandHandler,
];

const QUERY_HANDLERS = [GetUserRepetitionsQueryHandler];

@Module({
  imports: [InfrastructureModule, PrismaModule, ClockModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    RepetitionApiService,
  ],
  exports: [RepetitionApiService],
})
export class RepetitionModule {}
