import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../../dictionary/infrastructure/infrastructure.module';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [];

const QUERY_HANDLERS = [];

@Module({
  imports: [InfrastructureModule],
  providers: [...EVENT_HANDLERS, ...COMMAND_HANDLERS, ...QUERY_HANDLERS],
  exports: [],
})
export class AdminUserModule {}
