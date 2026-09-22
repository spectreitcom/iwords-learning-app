import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ClockModule } from '../../common/clock/clock.module';
import { MemoryScanApiService } from './memory-scan-api.service';
import { eventHandlers } from './event-handlers';
import { commandHandlers } from './command-handlers';
import { queryHandlers } from './query-handlers';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [PrismaModule, ClockModule, InfrastructureModule],
  providers: [
    MemoryScanApiService,
    ...eventHandlers,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [MemoryScanApiService],
})
export class MemoryScanModule {}
