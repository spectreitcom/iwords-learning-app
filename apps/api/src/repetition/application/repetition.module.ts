import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [...EVENT_HANDLERS, ...COMMAND_HANDLERS, ...QUERY_HANDLERS],
  exports: [],
})
export class RepetitionModule {}
